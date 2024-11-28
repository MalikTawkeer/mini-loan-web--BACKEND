import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  {
    timestamps: true,
  }
);

// *************** Register user ********
userSchema.statics.register = async function (name, email, password) {
  try {
    const existingUser = await this.findOne({ email });
    if (existingUser) throw "Email is alredy registered";

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await this({
      name,
      email,
      password: hashedPassword,
    });
    newUser.save();

    return newUser;
  } catch (error) {
    throw error;
  }
};

// *************** Login user *********
userSchema.statics.login = async function (email, password) {
  try {
    // Check if the user exists
    const user = await this.findOne({ email });
    if (!user) {
      throw "Incorrect email";
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw "Incorrect password";
    }

    // Return the user if login is successful
    return user;
  } catch (error) {
    throw error;
  }
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
