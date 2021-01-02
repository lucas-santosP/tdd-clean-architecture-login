import { MissingParamError } from "../../utils/generic-erros";

export default class AuthUseCase {
  constructor ({
    findUserByEmailRepository,
    encrypter,
    tokenGenerator,
    updateAccessTokenRepository,
  } = {}) {
    this.findUserByEmailRepository = findUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth ({ email, password }) {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    const user = await this.findUserByEmailRepository.find(email);
    if (!user) return null;

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate(user.id);
    await this.updateAccessTokenRepository.update(user.id, accessToken);
    return accessToken;
  }
}
