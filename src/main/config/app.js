import express from "express";
import setupApp from "./setup";
import setupRoutes from "./routes";

const app = express();
setupApp(app);
setupRoutes(app);

export default app;
