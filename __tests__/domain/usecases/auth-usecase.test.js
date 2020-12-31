class AuthUseCase {
  async auth ({ email, password }) {
    if (!email || !password) {
      throw new Error();
    }
    return "valid_token";
  }
}

describe("Auth usecase", () => {
  test("Should throw an error if no email is received", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth({ email: undefined, password: "any_pass" });

    await expect(promise).rejects.toThrow();
  });

  test("Should throw an error if no password is received", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth({ email: "any_email@email.com", password: undefined });

    await expect(promise).rejects.toThrow();
  });
});
