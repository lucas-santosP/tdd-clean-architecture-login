import { HttpResponse } from "../helpers";
import { MissingParamError, InvalidParamError } from "../errors";

export default class LoginRouter {
  constructor ({ authUseCase, emailValidator } = {}) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route (httpRequest) {
    if (
      !httpRequest ||
      !httpRequest.body ||
      !this.authUseCase ||
      !this.authUseCase.auth ||
      !this.emailValidator ||
      !this.emailValidator.validate
    ) {
      return HttpResponse.serverError();
    }

    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError("email"));
    }
    if (!this.emailValidator.validate(email)) {
      return HttpResponse.badRequest(new InvalidParamError("email"));
    }
    if (!password) {
      return HttpResponse.badRequest(new MissingParamError("password"));
    }

    const accessToken = await this.authUseCase.auth(email, password);
    if (!accessToken) {
      return HttpResponse.unauthorizedError();
    }
    return HttpResponse.ok({ accessToken });
  }
}
