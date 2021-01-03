import jwt from "jsonwebtoken";
import { MissingParamError } from "../generic-erros";

export default class TokenGenerator {
  constructor (secretKey) {
    this.secretKey = secretKey;
  }

  async generate (id) {
    if (!id) throw new MissingParamError("id");
    if (!this.secretKey) throw new MissingParamError("secretKey");

    const token = jwt.sign({ _id: id }, this.secretKey);
    return token;
  }
}
