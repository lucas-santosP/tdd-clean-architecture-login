import { InvalidParamError, MissingParamError } from "../../utils/generic-erros";

export default class AuthUseCase {
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
    const user = await this.findUserByEmailRepository.find(email);
    if (!user) {
      return null;
    }

    return null;
  }
}
