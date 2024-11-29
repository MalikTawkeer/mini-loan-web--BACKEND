// config/app.config.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// IMPORT CUSTOM ROUTES
import authRoutes from "../routes/auth.routes.js";
import loanRoutes from "../routes/loan.routes.js";
import repaymentRoutes from "../routes/repayment.routes.js";

const configureApp = () => {
  const app = express();
  
  // CORS configuration
      const corsOptions = {
       origin: 'http://localhost:5173', // Replace with your client URL
       credentials: true, // Allow credentials
     };

	app.use(cors(corsOptions));

  // Allow all origins
  //app.use(cors());

  // const corsOptions = {
  //   origin: ['http://example.com', 'http://another-origin.com'], // List of allowed origins
  //   methods: ['GET', 'POST'], // Allowed methods
  // };
  // app.use(cors(corsOptions));

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
