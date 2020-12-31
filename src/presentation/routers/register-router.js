import { HttpResponse } from "../helpers";
import { MissingParamError, InvalidParamError } from "../../utils/generic-erros";

export default class RegisterRouter {
  constructor ({ registerUser, emailSender, emailValidator } = {}) {
    this.registerUser = registerUser;
    this.emailSender = emailSender;
    this.emailValidator = emailValidator;
  }

  async route (httpRequest) {
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

      const registerUserResponse = await this.registerUser.register(userData);
      if (registerUserResponse.error) {
        return HttpResponse.badRequest(registerUserResponse.error);
      }

      const sendEmailResponse = await this.emailSender.sendToUser(userData);
      if (sendEmailResponse.error) {
        return HttpResponse.badRequest(sendEmailResponse.error);
      }

      return HttpResponse.ok(userData);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
}
