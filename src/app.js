import express from "express";

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
  }

  middlewares() {
    this.express.use(express.json());
  }
}

const app = new AppController();
export default app.express;
