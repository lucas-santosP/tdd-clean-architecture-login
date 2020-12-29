import { MissingParamError } from "./index";

export default class HttpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) };
  }

  static serverError () {
    return { statusCode: 500 };
  }
}
