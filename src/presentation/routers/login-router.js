import { HttpResponse } from "../helpers";
import { MissingParamError, InvalidParamError } from "../../utils/generic-erros";

export default class LoginRouter {
  constructor ({ authUseCase, emailValidator } = {}) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route (httpRequest) {
    try {
      const userData = { email: httpRequest.body.email, password: httpRequest.body.password };

      if (!userData.email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!userData.password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }
      if (!this.emailValidator.validate(userData.email)) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authUseCase.auth(userData);
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}
