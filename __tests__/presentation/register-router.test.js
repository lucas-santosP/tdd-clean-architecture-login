import RegisterRouter from "../../src/presentation/routers/register-router";
import { ServerError } from "../../src/presentation/errors";
import { MissingParamError, InvalidParamError } from "../../src/utils/generic-erros";

function makeSut () {
  const registerUser = makeRegisterUserSpy();
  const emailSender = makeEmailSenderSpy();
  const emailValidator = makeEmailValidatorSpy();
  const sut = new RegisterRouter({ registerUser, emailSender, emailValidator });

  return { sut, registerUser, emailSender, emailValidator };
}

function makeRegisterUserSpy () {
  class RegisterUser {
    async register ({ email, name }) {
      this.email = email;
      this.name = name;
      return this.wasRegistered;
    }
  }

  const registerUser = new RegisterUser();
  registerUser.wasRegistered = true;
  return registerUser;
}

function makeEmailSenderSpy () {
  class EmailSender {
    async sendToUser ({ email, name }) {
      this.email = email;
      this.name = name;
      return this.wasSended;
    }
  }

  const emailSender = new EmailSender();
  emailSender.wasSended = true;
  return emailSender;
}

function makeEmailValidatorSpy () {
  class EmailValidatorSpy {
    validate (email) {
      this.email = email;
      return this.isEmailValid;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.isEmailValid = true; // mock with default as valid data
  return emailValidatorSpy;
}

describe("Register Router", () => {
  test("Should return 400 if no email is received", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no name is received", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 401 if invalid email is received", async () => {
    const { sut, emailValidator } = makeSut();
    emailValidator.isEmailValid = false;
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call registerUser with correct params", async () => {
    const { sut, registerUser } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };
    await sut.route(httpRequest);

    expect(registerUser.email).toBe(httpRequest.body.email);
    expect(registerUser.name).toBe(httpRequest.body.name);
  });

  test("Should call emailSender with correct params", async () => {
    const { sut, emailSender } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };
    await sut.route(httpRequest);

    expect(emailSender.email).toBe(httpRequest.body.email);
  });

  test("Should call emailValidator with correct params", async () => {
    const { sut, emailValidator } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };
    await sut.route(httpRequest);

    expect(emailValidator.email).toBe(httpRequest.body.email);
  });

  test("Should return 500 if invalid emailSender is received", async () => {
    const registerUser = makeRegisterUserSpy();
    const emailValidator = makeEmailValidatorSpy();
    const suts = [
      new RegisterRouter({ registerUser, emailSender: undefined, emailValidator }),
      new RegisterRouter({ registerUser, emailSender: {}, emailValidator }),
    ];
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(new ServerError());
    }
  });

  test("Should return 500 if invalid registerUser is received", async () => {
    const emailSender = makeEmailSenderSpy();
    const emailValidator = makeEmailValidatorSpy();
    const suts = [
      new RegisterRouter({ registerUser: undefined, emailSender, emailValidator }),
      new RegisterRouter({ registerUser: {}, emailSender, emailValidator }),
    ];
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(new ServerError());
    }
  });

  test("Should return 500 if invalid emailValidator is received", async () => {
    const registerUser = makeRegisterUserSpy();
    const emailSender = makeEmailSenderSpy();
    const suts = [
      new RegisterRouter({ registerUser, emailSender, emailValidator: undefined }),
      new RegisterRouter({ registerUser, emailSender, emailValidator: {} }),
    ];
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(new ServerError());
    }
  });

  test("Should return 500 if emailSender throws", async () => {
    const { sut, emailSender } = makeSut();
    jest.spyOn(emailSender, "sendToUser").mockImplementation(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if registerUser throws", async () => {
    const { sut, registerUser } = makeSut();
    jest.spyOn(registerUser, "register").mockImplementation(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if emailValidator throws", async () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, "validate").mockImplementation(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if no dependencies are received", async () => {
    const sut = new RegisterRouter();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
      },
    };

    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
