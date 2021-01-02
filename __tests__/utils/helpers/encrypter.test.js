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
import { MissingParamError } from "../../../src/utils/generic-erros";

class Encrypter {
  async compare (value, hashedValue) {
    if (!value) throw new MissingParamError("value");
    if (!hashedValue) throw new MissingParamError("hashedValue");

    const isValid = await bcrypt.compare(value, hashedValue);
    return isValid;
  }
}

describe("Encrypter", () => {
  test("Should return true if bcrypt returns true", async () => {
    const sut = new Encrypter();
    const isValid = await sut.compare("any_value", "hashed_value");

    expect(isValid).toBe(true);
  });

  test("Should return false if bcrypt returns false", async () => {
    const sut = new Encrypter();
    bcrypt.isValid = false;
    const isValid = await sut.compare("any_value", "invalid_hashed_value");

    expect(isValid).toBe(false);
  });

  test("Should call bcrypt with correct params", async () => {
    const sut = new Encrypter();
    await sut.compare("any_value", "hashed_value");

    expect(bcrypt.value).toBe("any_value");
    expect(bcrypt.hash).toBe("hashed_value");
  });

  test("Should throw if no value param is received", async () => {
    const sut = new Encrypter();
    const promise = sut.compare();

    await expect(promise).rejects.toThrow(new MissingParamError("value"));
  });

  test("Should throw if no hashedValue param is received", async () => {
    const sut = new Encrypter();
    const promise = sut.compare("any_value");

    await expect(promise).rejects.toThrow(new MissingParamError("hashedValue"));
  });
});
