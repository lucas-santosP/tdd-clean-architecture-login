import { MissingParamError } from "../../../src/utils/generic-erros";

class AuthUseCase {
  async auth ({ email, password }) {
    if (!email) {
      throw new MissingParamError("email");
    }
    if (!password) {
      throw new MissingParamError("password");
    }
    return "valid_token";
  }
}

describe("Auth usecase", () => {
  test("Should throw an error if no email is received", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth({ email: undefined, password: "any_pass" });

    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw an error if no password is received", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth({ email: "any_email@email.com", password: undefined });

    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });
});
