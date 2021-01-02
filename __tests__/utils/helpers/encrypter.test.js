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

class Encrypter {
  async compare (value, hashedValue) {
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
});
