import express from "express";
import fg from "fast-glob";
const router = express.Router();

export default (app) => {
  app.use("", router);
  fg.sync("**/src/main/routes/**routes.js").forEach(async (file) => {
    await require(`../../../${file}`).default(router);
  });
};
