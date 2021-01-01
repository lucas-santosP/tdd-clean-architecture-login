import { InvalidParamError, MissingParamError } from "../../../src/utils/generic-erros";

class AuthUseCase {
  constructor ({ findUserByEmailRepository } = {}) {
    this.findUserByEmailRepository = findUserByEmailRepository;
  }

  async auth ({ email, password }) {
    if (!email) {
      throw new MissingParamError("email");
    }
    if (!password) {
      throw new MissingParamError("password");
    }
    if (!this.findUserByEmailRepository) {
      throw new MissingParamError("findUserByEmailRepository");
    }
    if (!this.findUserByEmailRepository.find) {
      throw new InvalidParamError("findUserByEmailRepository");
    }
    await this.findUserByEmailRepository.find(email);

    return "valid_token";
  }
}

class FindUserByEmailRepositorySpy {
  async find (email) {
    this.email = email;
  }
}

function makeSut () {
  const findUserByEmailRepository = new FindUserByEmailRepositorySpy();
  const sut = new AuthUseCase({ findUserByEmailRepository });

  return { sut, findUserByEmailRepository };
}

describe("Auth usecase", () => {
  test("Should throw an error if no email is received", async () => {
    const { sut } = makeSut();
    const promise = sut.auth({ email: undefined, password: "any_pass" });

    await expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  test("Should throw an error if no password is received", async () => {
    const { sut } = makeSut();
    const promise = sut.auth({ email: "any_email@email.com", password: undefined });

    await expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  test("Should call findUserByEmail with correct params", async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    const userData = { email: "any_email@email.com", password: "any_pass" };
    await sut.auth(userData);

    expect(findUserByEmailRepository.email).toBe(userData.email);
  });

  test("Should throws if no findUserByEmailRepository is received", async () => {
    const sut = new AuthUseCase({ findUserByEmailRepository: undefined });
    const userData = { email: "any_email@email.com", password: "any_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow(new MissingParamError("findUserByEmailRepository"));
  });

  test("Should throws if invalid findUserByEmailRepository is received", async () => {
    const sut = new AuthUseCase({ findUserByEmailRepository: {} });
    const userData = { email: "any_email@email.com", password: "any_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow(new InvalidParamError("findUserByEmailRepository"));
  });
});
