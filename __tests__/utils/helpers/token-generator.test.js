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
import { MissingParamError } from "../../../src/utils/generic-erros";

class TokenGenerator {
  constructor (secretKey) {
    this.secretKey = secretKey;
  }

  async generate (id) {
    if (!id) throw new MissingParamError("id");
    if (!this.secretKey) throw new MissingParamError("secretKey");

    const token = jwt.sign(id, this.secretKey);
    return token;
  }
}

function makeSut () {
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

  test("Should throw if no secretKey param is received", async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate("any_id");

    await expect(promise).rejects.toThrow(new MissingParamError("secretKey"));
  });

  test("Should throw if no id param is received", async () => {
    const { sut } = makeSut();
    const promise = sut.generate();

    await expect(promise).rejects.toThrow(new MissingParamError("id"));
  });
});
