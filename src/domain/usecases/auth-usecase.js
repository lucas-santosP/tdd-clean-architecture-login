import { MissingParamError } from "../../utils/generic-erros";

export default class AuthUseCase {
  constructor ({ userRepository, encrypter, tokenGenerator } = {}) {
    this.userRepository = userRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth ({ email, password }) {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    const accessToken = await this.tokenGenerator.generate(user._id);
    await this.userRepository.updateAccessToken(user._id, accessToken);
    return accessToken;
  }
}
