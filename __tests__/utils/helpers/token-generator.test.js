/* eslint-disable import/first */
jest.mock("jsonwebtoken", () => ({
  token: "any_token",

  sign (value, secretKey) {
    this.value = value;
    this.secretKey = secretKey;
    return this.token;
  },
}));

import jwt from "jsonwebtoken";

function makeSut () {
  class TokenGenerator {
    async generate (id) {
      this.id = id;
      return jwt.sign(id, "secret_key");
    }
  }
  const sut = new TokenGenerator();
  return { sut };
}

describe("Token Generator", () => {
  test("Should return a token if JWT returns token", async () => {
    const { sut } = makeSut();
    const token = await sut.generate("any_id");

    expect(token).toBe(jwt.token);
  });

  test("Should return null if JWT returns null", async () => {
    const { sut } = makeSut();
    jwt.token = null;
    const token = await sut.generate("any_id");

    expect(token).toBe(null);
  });
});
