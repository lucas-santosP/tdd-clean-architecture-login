import LoginRouter from "./login-router";
import { MissingParamError, UnauthorizedError, ServerError } from "../errors";

function makeSut () {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email;
      this.password = password;
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);
  return { authUseCaseSpy, sut };
}

describe("Login Router", () => {
  test("Should return 400 if no email is received", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "any_pass",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is received", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 500 if no httpRequest is received", () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 500 if httpRequest has no body", () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test("Should return 401 if received invalid credentials", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "invalid_email@email.com",
        password: "invalid_pass",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedError());
  });

  test("Should return 500 if no authUsecase is received", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if authUsecase has no auth method", () => {
    class AuthUseCaseSpy {}
    const sut = new LoginRouter(new AuthUseCaseSpy());
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should call AuthUseCase with correct params", () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_pass",
      },
    };
    sut.route(httpRequest);

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });
});
