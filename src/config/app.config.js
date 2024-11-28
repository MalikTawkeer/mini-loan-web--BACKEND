// config/app.config.js
import express from "express";
import cookieParser from "cookie-parser";

// IMPORT CUSTOM ROUTES
import authRoutes from "../routes/authentication/auth.routes.js";

const configureApp = () => {
  const app = express();

  // Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/auth", authRoutes);

  return app;
};

export default configureApp;