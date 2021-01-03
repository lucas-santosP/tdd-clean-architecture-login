import { cors, jsonParser } from "../middlewares";

export default function setup (app) {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(jsonParser);
}
