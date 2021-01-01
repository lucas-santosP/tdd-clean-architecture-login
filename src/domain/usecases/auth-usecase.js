import { MissingParamError } from "../../utils/generic-erros";

export default class AuthUseCase {
  constructor ({ findUserByEmailRepository, encrypter } = {}) {
    this.findUserByEmailRepository = findUserByEmailRepository;
    this.encrypter = encrypter;
  }

  async auth ({ email, password }) {
    if (!email) {
      throw new MissingParamError("email");
    }
    if (!password) {
      throw new MissingParamError("password");
    }

    const user = await this.findUserByEmailRepository.find(email);
    if (!user) {
      return null;
    }
    await this.encrypter.compare(password, user.password);
    return null;
  }
}
