import mongoose from "mongoose";

import { conf } from "../config/config.js";

const connectDatabase = async () => {
  try {
    await mongoose.connect(conf.DB_URL);

    console.log("Successfully Connected to DB");
  } catch (error) {
    console.log(error, "Error while connecting to DB");
  }
};

export default connectDatabase;