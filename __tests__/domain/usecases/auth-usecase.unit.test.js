import { MissingParamError } from "../../../src/utils/generic-erros";
import AuthUseCase from "../../../src/domain/usecases/auth-usecase";

function makeSut () {
  const userRepository = makeUserRepositorySpy();
  const encrypter = makeEncrypterSpy();
  const tokenGenerator = makeTokenGeneratorSpy();
  const sut = new AuthUseCase({
    userRepository,
    encrypter,
    tokenGenerator,
  });

  return { sut, userRepository, encrypter, tokenGenerator };
}

function makeUserRepositorySpy () {
  class UserRepositorySpy {
    async findByEmail (email) {
      this.findByEmail.email = email;
      return this.findByEmail.user;
    }

    async updateAccessToken (userId, accessToken) {
      this.updateAccessToken.userId = userId;
      this.updateAccessToken.accessToken = accessToken;
    }
  }

  const userRepository = new UserRepositorySpy();
  // mock valid data as default
  userRepository.findByEmail.user = {
    name: "any_name",
    email: "valid_repo_email@email.com",
    password: "hashed_pass",
    _id: "any_id",
  };
  return userRepository;
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

  test("Should throw if invalid dependency is received", async () => {
    const userRepository = makeUserRepositorySpy();
    const encrypter = makeEncrypterSpy();
    const tokenGenerator = makeTokenGeneratorSpy();
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        userRepository: {},
        encrypter,
        tokenGenerator,
      }),
      new AuthUseCase({
        userRepository,
        encrypter: {},
        tokenGenerator,
      }),
      new AuthUseCase({
        userRepository,
        encrypter,
        tokenGenerator: {},
      }),
    ];
    const userData = { email: "any_email@email.com", password: "any_pass" };

    for (const sut of suts) {
      const promise = sut.auth(userData);

      await expect(promise).rejects.toThrow();
    }
  });

  test("Should throw if userRepository method findByEmail throws", async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, "findByEmail").mockImplementation(() => {
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

  test("Should throw if userRepository method updateAccessToken throws", async () => {
    const { sut, userRepository } = makeSut();
    jest.spyOn(userRepository, "updateAccessToken").mockImplementation(() => {
      throw new Error();
    });
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const promise = sut.auth(userData);

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if invalid email is received", async () => {
    const { sut, userRepository } = makeSut();
    userRepository.findByEmail.user = null;
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

  test("Should call userRepository method findByEmail with correct params", async () => {
    const { sut, userRepository } = makeSut();
    const userData = { email: "any_email@email.com", password: "any_pass" };
    await sut.auth(userData);

    expect(userRepository.findByEmail.email).toBe(userData.email);
  });

  test("Should call encrypter with correct params", async () => {
    const { sut, userRepository, encrypter } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    expect(encrypter.password).toBe(userData.password);
    expect(encrypter.hashedPassword).toBe(userRepository.findByEmail.user.password);
  });

  test("Should call tokenGenerator with correct params", async () => {
    const { sut, userRepository, tokenGenerator } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    expect(tokenGenerator.userId).toBe(userRepository.findByEmail.user._id);
  });

  test("Should call userRepository method updateAccessToken with correct params", async () => {
    const { sut, userRepository, tokenGenerator } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    await sut.auth(userData);

    expect(userRepository.updateAccessToken.userId).toBe(userRepository.findByEmail.user._id);
    expect(userRepository.updateAccessToken.accessToken).toBe(tokenGenerator.accessToken);
  });

  test("Should return an accessToken if valid credentials are received", async () => {
    const { sut, tokenGenerator } = makeSut();
    const userData = { email: "valid_email@email.com", password: "valid_pass" };
    const accessToken = await sut.auth(userData);

    expect(tokenGenerator.accessToken).toBe(accessToken);
    expect(tokenGenerator.accessToken).toBeTruthy();
  });
});
