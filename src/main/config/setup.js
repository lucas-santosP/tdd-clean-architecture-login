import { cors, jsonParser, contentType } from "../middlewares";

export default function setup (app) {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(jsonParser);
  app.use(contentType);
}
