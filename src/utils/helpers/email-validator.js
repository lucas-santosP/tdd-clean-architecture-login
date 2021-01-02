import validator from "validator";

export default class EmailValidator {
  validate (email) {
    return validator.isEmail(email);
  }
}
