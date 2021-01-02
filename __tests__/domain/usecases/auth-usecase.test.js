import { MissingParamError } from "../../../src/utils/generic-erros";
import AuthUseCase from "../../../src/domain/usecases/auth-usecase";

function makeSut () {
  const findUserByEmailRepository = makeFindUserByEmailRepositorySpy();
  const encrypter = makeEncrypterSpy();
  const tokenGenerator = makeTokenGeneratorSpy();
  const sut = new AuthUseCase({ findUserByEmailRepository, encrypter, tokenGenerator });

  return { sut, findUserByEmailRepository, encrypter, tokenGenerator };
}

function makeFindUserByEmailRepositorySpy () {
  class FindUserByEmailRepositorySpy {
    async find (email) {
      this.email = email;
      return this.user;
    }
  }

  const findUserByEmailRepository = new FindUserByEmailRepositorySpy();
  // mock valid data as default
  findUserByEmailRepository.user = {
    email: "valid_repo_email@email.com",
    password: "hashed_pass",
    id: "any_id",
  };
  return findUserByEmailRepository;
}

function makeEncrypterSpy () {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }

  const encrypter = new EncrypterSpy();
  encrypter.isValid = true;
  return encrypter;
}

function makeTokenGeneratorSpy () {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGenerator = new TokenGeneratorSpy();
  tokenGenerator.accessToken = "any_token";
  return tokenGenerator;
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

  test("Should throw if invalid dependency is received", async () => {
    const findUserByEmailRepository = makeFindUserByEmailRepositorySpy();
    const encrypter = makeEncrypterSpy();
    const tokenGenerator = makeTokenGeneratorSpy();
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ findUserByEmailRepository: undefined, encrypter, tokenGenerator }),
      new AuthUseCase({ findUserByEmailRepository: {}, encrypter, tokenGenerator }),
      new AuthUseCase({ findUserByEmailRepository, encrypter: undefined, tokenGenerator }),
      new AuthUseCase({ findUserByEmailRepository, encrypter: {}, tokenGenerator }),
      new AuthUseCase({ findUserByEmailRepository, encrypter, tokenGenerator: undefined }),
      new AuthUseCase({ findUserByEmailRepository, encrypter, tokenGenerator: {} }),
    ];
    const userData = { email: "any_email@email.com", password: "any_pass" };

    for (const sut of suts) {
      const promise = sut.auth(userData);

      await expect(promise).rejects.toThrow();
    }
  });

  test("Should throw if findUserByEmailRepository throws", async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    jest.spyOn(findUserByEmailRepository, "find").mockImplementation(() => {
      throw new Error();
    });
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow();
  });

  test("Should throw if encrypter throws", async () => {
    const { sut, encrypter } = makeSut();
    jest.spyOn(encrypter, "compare").mockImplementation(() => {
      throw new Error();
    });
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow();
  });

  test("Should throw if tokenGenerator throws", async () => {
    const { sut, tokenGenerator } = makeSut();
    jest.spyOn(tokenGenerator, "generate").mockImplementation(() => {
      throw new Error();
    });
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if invalid email is received", async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    findUserByEmailRepository.user = null;
    const userData = { email: "invalid_email@email.com", password: "any_pass" };
    const accessToken = await sut.auth(userData);

    expect(accessToken).toBeNull();
  });

  test("Should return null if invalid password is received", async () => {
    const { sut, encrypter } = makeSut();
    encrypter.isValid = false;
    const userData = { email: "valid_email@email.com", password: "invalid_pass" };
    const accessToken = await sut.auth(userData);

    expect(accessToken).toBeNull();
  });

  test("Should call encrypter with correct params", async () => {
    const { sut, encrypter, findUserByEmailRepository } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    expect(encrypter.password).toBe(userData.password);
    expect(encrypter.hashedPassword).toBe(findUserByEmailRepository.user.password);
  });

  test("Should call tokenGenerator with correct params", async () => {
    const { sut, tokenGenerator, findUserByEmailRepository } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    expect(tokenGenerator.userId).toBe(findUserByEmailRepository.user.id);
  });

  test("Should return an accessToken if valid credentials are received", async () => {
    const { sut, tokenGenerator } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const accessToken = await sut.auth(userData);

    expect(tokenGenerator.accessToken).toBe(accessToken);
    expect(tokenGenerator.accessToken).toBeTruthy();
  });
});
