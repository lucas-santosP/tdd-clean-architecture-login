/* eslint-disable import/first */
jest.mock("jsonwebtoken", () => ({
  token: "any_token",

  sign (payload, secretKey) {
    this.payload = payload;
    this.secretKey = secretKey;
    return this.token;
  },
}));

import jwt from "jsonwebtoken";

function makeSut () {
  class TokenGenerator {
    constructor (secretKey) {
      this.secretKey = secretKey;
    }

    async generate (id) {
      this.id = id;
      return jwt.sign(id, this.secretKey);
    }
  }

  const sut = new TokenGenerator("secret_key");
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

  test("Should call JWT with correct params", async () => {
    const { sut } = makeSut();
    await sut.generate("any_id");

    expect(jwt.payload).toBe("any_id");
    expect(jwt.secretKey).toBe(sut.secretKey);
  });
});
