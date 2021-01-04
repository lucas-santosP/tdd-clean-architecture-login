import app from "./config/app";
import MongoHelper from "../infrastructure/helpers/mongo-helper";
import env from "./config/env";

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
  })
  .catch(console.error);
