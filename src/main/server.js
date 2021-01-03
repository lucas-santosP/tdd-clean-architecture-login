import app from "./config/app";
// import MongoHelper from "../infrastructure/helpers/mongo-helper";
// import env from "./config/env";
// MongoHelper.connect(env.mongoUrl)
//   .then(async () => {
//     const app = (await import("./config/app")).default;
//   })
//   .catch(console.error);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running at http://localhost:3000");
});
