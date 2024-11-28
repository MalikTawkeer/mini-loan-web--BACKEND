import jwt from "jsonwebtoken";
import { conf } from "../config/config.js";

import User from "../models/users.model.js";

const authenticateJWT = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req?.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(403)
        .json({ message: "No Token provided or invalid format!!" }); // Check if Bearer token is present
    }

    // Extract the token (split on the space and take the second part)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No Token provided!!" }); // Return here to avoid further execution
    }

    // Verify the token
    const decoded = jwt.verify(token, conf.JWT_SECRET_KEY);

    // Check if user (customer)
    const user = await User.findById(decoded?.id);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Access denied, Unauthorized user!" }); // Return to avoid next call
    }

    // Attach user object to the request
    req.user = user;

    // Proceed to the next middleware if all checks pass
    next();
  } catch (err) {
    console.error("Something went wrong verifying token", err);
    return res.status(403).json({ error: "Token verification failed!" });
  }
};

export default authenticateJWT;
