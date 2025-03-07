import { User } from "../models/index.js";
import { College } from "../models/college.model.js";
import { Student } from "../models/student.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// dotenv.config({ path: "../../.env" });
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, wallet_address, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { wallet_address }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or wallet already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let roleDoc;
    let roleModel;
    if (role === "Student") {
      roleDoc = new Student({ portfolio_token_id: null, badges: [] });
      roleModel = "Student";
    } else if (role === "College") {
      roleDoc = new College({ college_name: name });
      roleModel = "College";
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    await roleDoc.save();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      wallet_address,
      role: roleDoc._id,
      roleModel,
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: roleModel },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({ user, roleDoc, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const populatedUser = await User.findOne({ email }).populate({
      path: "role",
      model: existingUser.roleModel,
    });
    if (!populatedUser) {
      return res.status(404).json({ message: "User not found after population" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, populatedUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: populatedUser._id, role: populatedUser.roleModel },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({ user: populatedUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};