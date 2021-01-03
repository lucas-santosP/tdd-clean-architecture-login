import LoginRouter from "../../presentation/routers/login-router";
import AuthUseCase from "../../domain/usecases/auth-usecase";
import UserRepository from "../../infrastructure/repositories/user-repository";
import { TokenGenerator, Encrypter, EmailValidator } from "../../utils/helpers";
import env from "../config/env";

export default class LoginRouterComposer {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.tokenSecret);
    const encrypter = new Encrypter();
    const userRepository = new UserRepository();
    const emailValidator = new EmailValidator();
    const authUseCase = new AuthUseCase({ userRepository, encrypter, tokenGenerator });

    return new LoginRouter({ authUseCase, emailValidator });
  }
}
