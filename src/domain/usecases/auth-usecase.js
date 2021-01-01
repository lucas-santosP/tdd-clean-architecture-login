import { MissingParamError } from "../../utils/generic-erros";

export default class AuthUseCase {
  constructor ({ findUserByEmailRepository, encrypter, tokenGenerator } = {}) {
    this.findUserByEmailRepository = findUserByEmailRepository;
    this.encrypter = encrypter;
    this.tokenGenerator = tokenGenerator;
  }

  async auth ({ email, password }) {
    if (!email) throw new MissingParamError("email");
    if (!password) throw new MissingParamError("password");

    const user = await this.findUserByEmailRepository.find(email);
    if (!user) return null;

    const isValid = await this.encrypter.compare(password, user.password);
    if (!isValid) return null;

    this.tokenGenerator.generate(user.id);
  }
}
