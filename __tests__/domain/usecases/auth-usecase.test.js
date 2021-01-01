import { MissingParamError } from "../../../src/utils/generic-erros";
import AuthUseCase from "../../../src/domain/usecases/auth-usecase";

function makeSut () {
  class FindUserByEmailRepositorySpy {
    async find (email) {
      this.email = email;
      return this.user;
    }
  }

  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
    }
  }

  const findUserByEmailRepository = new FindUserByEmailRepositorySpy();
  const encrypter = new EncrypterSpy();
  findUserByEmailRepository.user = { email: "valid_repo_email@email.com", password: "hashed_pass" }; // mock valida data as default
  const sut = new AuthUseCase({ findUserByEmailRepository, encrypter });

  return { sut, findUserByEmailRepository, encrypter };
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

  test("Should throws if invalid dependency is received", async () => {
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

  test("Should call encrypter with correct params", async () => {
    const { sut, encrypter, findUserByEmailRepository } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    await expect(encrypter.password).toBe(userData.password);
    await expect(encrypter.hashedPassword).toBe(findUserByEmailRepository.user.password);
  });
});
