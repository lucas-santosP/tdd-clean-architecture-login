import RegisterRouter from "../../src/presentation/routers/register-router";
import { MissingParamError, ServerError } from "../../src/presentation/errors";

function makeSut () {
  const registerUser = makeRegisterUserSpy();
  const emailSender = makeEmailSenderSpy();
  const emailValidator = makeEmailValidatorSpy();
  const sut = new RegisterRouter({
    registerUser,
    emailSender,
    emailValidator,
  });

  return { sut, emailSender, emailValidator };
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

describe("Reigster Router", () => {
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
});
