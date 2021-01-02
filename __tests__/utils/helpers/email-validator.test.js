/* eslint-disable import/first */
jest.mock("validator", () => ({
  isEmailValid: true,

  isEmail (email) {
    this.email = email;
    return this.isEmailValid;
  },
}));

import validator from "validator";
import { EmailValidator } from "../../../src/utils/helpers";

function makeSut () {
  const sut = new EmailValidator();
  return { sut };
}

describe("Email Validator", () => {
  test("Should return true if valid email is received", async () => {
    const { sut } = makeSut();
    const isEmailValid = sut.validate("valid_email@email.com");

    expect(isEmailValid).toBe(true);
  });

  test("Should return false if invalid email is received", async () => {
    const { sut } = makeSut();
    validator.isEmailValid = false;
    const isEmailValid = sut.validate("invalid_email@email.com");

    expect(isEmailValid).toBe(false);
  });

  test("Should call validator with correct params", async () => {
    const { sut } = makeSut();
    sut.validate("any_email@email.com");

    expect(validator.email).toBe("any_email@email.com");
  });
});
