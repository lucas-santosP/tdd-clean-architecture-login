import { UnauthorizedError, ServerError } from "../errors";
import { serializeError } from "serialize-error";

export default class HttpResponse {
  static badRequest (error) {
    return { statusCode: 400, body: serializeError(error) };
  }

  static serverError () {
    return { statusCode: 500, body: serializeError(new ServerError()) };
  }

  static unauthorizedError () {
    return { statusCode: 401, body: serializeError(new UnauthorizedError()) };
  }

  static ok (body) {
    return { statusCode: 200, body };
  }
}
