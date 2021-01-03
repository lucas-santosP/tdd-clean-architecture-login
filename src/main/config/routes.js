import express from "express";
import fg from "fast-glob";
const router = express.Router();

export default (app) => {
  app.use("/api", router);

  fg.sync("**/src/main/routes/**routes.js").forEach((file) => {
    require(`../../../${file}`).default(router);
  });
};
