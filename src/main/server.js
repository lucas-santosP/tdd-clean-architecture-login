import app from "./config/app";
import mongoHelper from "../infrastructure/repositories/helpers/mongo-helper";

mongoHelper.connect();

app.listen(process.env.PORT || 3000, () => {
  console.log("Willay!!");
});
