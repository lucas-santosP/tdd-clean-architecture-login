import { HttpResponse } from "../helpers";
import { MissingParamError, InvalidParamError } from "../../utils/generic-erros";

export default class RegisterRouter {
  constructor ({ registerUser, emailSender, emailValidator } = {}) {
    this.registerUser = registerUser;
    this.emailSender = emailSender;
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest) {
    try {
      const userData = { name: httpRequest.body.name, email: httpRequest.body.email };

      if (!userData.name) {
        return HttpResponse.badRequest(new MissingParamError("name"));
      }
      if (!userData.email) {
        return HttpResponse.badRequest(new MissingParamError("email"));
      }
      if (!this.emailValidator.validate(userData.email)) {
        return HttpResponse.badRequest(new InvalidParamError("email"));
      }
      await this.registerUser.register(userData);
      await this.emailSender.sendToUser(userData);

      return HttpResponse.ok(userData);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}
