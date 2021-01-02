/* eslint-disable import/first */
jest.mock("bcrypt", () => ({
  isValid: true,

  async compare (value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  },
}));

import bcrypt from "bcrypt";
import { Encrypter } from "../../../src/utils/helpers";
import { MissingParamError } from "../../../src/utils/generic-erros";

function makeSut () {
  const sut = new Encrypter();
  return { sut };
}

describe("Encrypter", () => {
  test("Should return true if bcrypt returns true", async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare("any_value", "hashed_value");

    expect(isValid).toBe(true);
  });

  test("Should return false if bcrypt returns false", async () => {
    const { sut } = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "invalid_hashed_value");

    expect(isValid).toBe(false);
  });

  test("Should call bcrypt with correct params", async () => {
    const { sut } = makeSut();
    await sut.compare("any_value", "hashed_value");

    expect(bcrypt.value).toBe("any_value");
    expect(bcrypt.hash).toBe("hashed_value");
  });

  test("Should throw if no value param is received", async () => {
    const { sut } = makeSut();
    const promise = sut.compare();

    await expect(promise).rejects.toThrow(new MissingParamError("value"));
  });

  test("Should throw if no hashedValue param is received", async () => {
    const { sut } = makeSut();
    const promise = sut.compare("any_value");

    await expect(promise).rejects.toThrow(new MissingParamError("hashedValue"));
  });
});
