import { HttpResponse } from "../helpers";
import { MissingParamError, InvalidParamError } from "../../utils/generic-erros";

export default class LoginRouter {
  constructor ({ authUseCase, emailValidator } = {}) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError("password"));
      }
      if (!this.emailValidator.validate(email)) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
      }

      const accessToken = await this.authUseCase.auth({ email, password });
      if (!accessToken) {
        return HttpResponse.unauthorizedError();
      }
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}
