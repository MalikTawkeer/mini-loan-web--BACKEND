import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { conf } from "../config/config.js";

import UserModel from "../models/users.model.js";

import registerUserValidationSchema from "../validations/register.validation.js";
import loginUserValidationSchema from "../validations/login.validation.js";

// import sendEmail from "../../utils/email.sender.js";

// JWT Token age
const JWT_MAX_AGE = "5d";

const createToken = (user) => {
  // Generate a JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    conf.JWT_SECRET_KEY,
    {
      expiresIn: JWT_MAX_AGE,
    }
  );

  return token;
};

// Register customer
const register = async (req, res) => {
  try {
    // VALIDATE USER INPUTS
    await registerUserValidationSchema.validate(req.body, {
      abortEarly: true, // Validates all fields before throwing an error
    });

    const { name, email, password } = req.body;

    const user = await UserModel.register(name, email, password);
    if (!user) return res.status(400).json({ msg: "somthing went wrong!" });

    return res.status(201).json({
      message: "User Created!",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error, "Error while registering user");
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

// Login Customer
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // VALIDATE USER INPUTS
    await loginUserValidationSchema.validate(req.body, {
      abortEarly: true, // Validates all fields before throwing an error
    });

    const user = await UserModel.login(email, password, role);
    if (!user) return res.status(400).json({ msg: "somthing went wrong!" });

    const token = createToken(user);

    // Send the token as a cookie
    res.cookie("jwt_tkn", token, {
      httpOnly: false, // Accessible only by the web server, not JavaScript on the client-side
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Helps prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Token expiration: 1 day
    });

    // Send a success message or user info (without password)
    res.json({
      message: "Login successful",
      user: { id: user._id, email: user?.email, name: user?.name },
    });
  } catch (error) {
    console.log(error, "Error while logging in User");
    return res
      .status(500)
      .json({ message: "internal server error", error: error });
  }
};

// Forgot Password
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const origin = req.get("origin") || req.get("referer");

//     const user = await UserModel.findOne({ email });
//     if (!user) return res.status(404).json("User not found!");

//     const token = crypto.randomBytes(20).toString("hex");

//     user.reset_password_token = token;
//     user.reset_password_expiry = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Send email
//     const emailStatus = await sendEmail(
//       "Fruit-Inventory-sys",
//       user.email,
//       "Password reset",

//       `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
//         `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
//         `http://${origin}/reset-pass/${token}\n\n` +
//         `If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     );

//     // Send response to user
//     return res.status(200).json({
//       message: "Password reset email sent, please check email",
//       emailStatus,
//       status: true,
//     });

//     // check emil exists
//     // generate token
//     // store tkn into DB
//     // send email
//     // succss
//   } catch (error) {
//     console.log(error, "Error while forgoting pass");
//     res.status(500).json(error);
//   }
// };

// // Reset password
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;

//     const user = await CustomerModel.findOne({
//       reset_password_token: token,
//       reset_password_expiry: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "Password link expired or Invalid token" });
//     }

//     const { newPassword } = req.body;

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.password = hashedPassword;
//     user.reset_password_token = undefined;
//     user.reset_password_expiry = undefined;
//     await user.save();

//     return res.status(200).json({ message: "Password has been reset" });

//     // destructre token
//     // find for token and check token exp is gtr than curr data in DB
//     // destructure newPassword
//     // hash the password
//     // undefine tkn and time
//     // store into DB
//     // send success
//   } catch (error) {
//     console.log(error, "Error while resetting password!");
//     res.status(500).json(error);
//   }
// };

export { register, login };
