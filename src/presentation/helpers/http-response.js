import { UnauthorizedError, ServerError } from "../errors";

export default class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, body: error };
  }

  static serverError () {
    return { statusCode: 500, body: new ServerError() };
  }

  static unauthorizedError () {
    return { statusCode: 401, body: new UnauthorizedError() };
  }

  static ok (body) {
    return { statusCode: 200, body };
  }
}
