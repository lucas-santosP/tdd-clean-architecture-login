import { MissingParamError } from "../../../src/utils/generic-erros";
import AuthUseCase from "../../../src/domain/usecases/auth-usecase";

function makeSut () {
  class FindUserByEmailRepositorySpy {
    async find (email) {
      this.email = email;
      return this.user;
    }
  }

  const findUserByEmailRepository = new FindUserByEmailRepositorySpy();
  findUserByEmailRepository.user = { email: "valid_emai@email.com", password: "valid_pass" }; // mock valida data as default
  const sut = new AuthUseCase({ findUserByEmailRepository });

  return { sut, findUserByEmailRepository };
}

describe("Auth usecase", () => {
  test("Should throw an error if no email is received", async () => {
    const { sut } = makeSut();
    const userData = { email: undefined, password: "any_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw an error if no password is received", async () => {
    const { sut } = makeSut();
    const userData = { email: "any_email@email.com", password: undefined };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call findUserByEmail with correct params", async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    const userData = { email: "any_email@email.com", password: "any_pass" };
    await sut.auth(userData);

    expect(findUserByEmailRepository.email).toBe(userData.email);
  });

  test("Should throws if invalid findUserByEmailRepository is received", async () => {
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({ findUserByEmailRepository: undefined }),
      new AuthUseCase({ findUserByEmailRepository: {} }),
    ];
    const userData = { email: "any_email@email.com", password: "any_pass" };

    for (const sut of suts) {
      const promise = sut.auth(userData);

      await expect(promise).rejects.toThrow();
    }
  });

  test("Should return null if invalid email is received", async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    findUserByEmailRepository.user = null;
    const userData = { email: "invalid_email@email.com", password: "any_pass" };
    const accessToken = await sut.auth(userData);

    await expect(accessToken).toBeNull();
  });

  test("Should return null if invalid password is received", async () => {
    const { sut } = makeSut();
    const userData = { email: "valid_email@email.com", password: "invalid_pass" };
    const accessToken = await sut.auth(userData);

    await expect(accessToken).toBeNull();
  });
});
