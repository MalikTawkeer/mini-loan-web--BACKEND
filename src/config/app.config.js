// config/app.config.js
import express from "express";
import cookieParser from "cookie-parser";

// IMPORT CUSTOM ROUTES
import authRoutes from "../routes/auth.routes.js";
import loanRoutes from "../routes/loan.routes.js";
import repaymentRoutes from "../routes/repayment.routes.js";

const configureApp = () => {
  const app = express();

  // Middlewares
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/auth", authRoutes);

  app.use("/api/loan", loanRoutes);

  app.use("/api/repayment", repaymentRoutes);

  return app;
};

export default configureApp;
