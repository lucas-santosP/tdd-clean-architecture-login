import { MissingParamError, UnauthorizedError, ServerError } from "../errors";

export default class HttpResponse {
  static badRequest (paramName) {
    return { statusCode: 400, body: new MissingParamError(paramName) };
  }

  static serverError () {
    return { statusCode: 500, body: new ServerError() };
  }

  static unauthorizedError () {
    return { statusCode: 401, body: new UnauthorizedError() };
  }
}
