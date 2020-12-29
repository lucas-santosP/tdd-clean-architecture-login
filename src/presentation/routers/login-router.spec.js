import LoginRouter from "./login-router";
import { MissingParamError } from "../helpers";

function makeSut () {
  // sut - system under test
  return new LoginRouter();
}

describe("Login Router", () => {
  test("Should return 400 if no email is received", () => {
    const sut = makeSut();
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
    const sut = makeSut();
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
    const sut = makeSut();
    const httpResponse = sut.route();

    expect(httpResponse.statusCode).toBe(500);
  });

  test("Should return 500 if httpRequest has no body ", () => {
    const sut = makeSut();
    const httpRequest = {};
    const httpResponse = sut.route(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
  });
});
