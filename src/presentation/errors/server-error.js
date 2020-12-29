export default class ServerError extends Error {
  constructor () {
    super("An internal error, try later");
    this.name = "ServerError";
  }
}
