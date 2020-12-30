import LoginRouter from "./login-router";
import { MissingParamError, UnauthorizedError, ServerError, InvalidParamError } from "../errors";

function makeSut () {
  const authUseCaseSpy = makeAuthUseCaseSpy();
  const emailValidatorSpy = makeEmailValidatorSpy();
  // mock with default as valid data
  authUseCaseSpy.accessToken = "valid_token";
  emailValidatorSpy.isEmailValid = true;
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy);

  return { sut, authUseCaseSpy, emailValidatorSpy };
}

function makeAuthUseCaseSpy () {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }

  return new AuthUseCaseSpy();
}

function makeEmailValidatorSpy () {
  class EmailValidatorSpy {
    validate (email) {
      return this.isEmailValid;
    }
  }

  return new EmailValidatorSpy();
}

describe("Login Router", () => {
  test("Should return 400 if no email is received", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is received", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 500 if no httpRequest is received", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if httpRequest has no body", async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 401 if invalid credentials are received", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "invalid_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 200 if valid credentials are received", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "valid_email@email.com",
        password: "valid_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
  });

  test("Should return 500 if no authUsecase is received", async () => {
    const authUsecase = undefined;
    const sut = new LoginRouter(authUsecase);
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if authUsecase has no auth method", async () => {
    class AuthUseCaseSpy {}
    const sut = new LoginRouter(new AuthUseCaseSpy());
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should call AuthUseCase with correct params", async () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    await sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  test("Should return 400 if invalid email is received", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "any_pass",
      },
    };
    const httpResponse = await sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should return 500 if invalid emailValidator is received", async () => {
    const authUseCaseSpy = makeAuthUseCaseSpy();
    authUseCaseSpy.accessToken = "valid_token";
    const suts = [new LoginRouter(authUseCaseSpy, undefined), new LoginRouter(authUseCaseSpy, {})];

    for (const sut of suts) {
      const httpRequest = { body: { email: "any_email@email.com", password: "any_pass" } };
      const httpResponse = await sut.route(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body).toEqual(new ServerError());
    }
  });
});
