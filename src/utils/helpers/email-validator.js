import validator from "validator";
import { MissingParamError } from "../generic-erros";

export default class EmailValidator {
  validate (email) {
    if (!email) throw new MissingParamError("email");

    return validator.isEmail(email);
  }
}
