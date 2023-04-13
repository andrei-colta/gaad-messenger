import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new UserModel({ name, email, password: hashedPassword });
  await user.save();

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, "mysecretkey");

  return res.status(201).json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, "mysecretkey");

  return res.status(200).json({ user, token });
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  // Find user
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email, password } = req.body;

  // Find user
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update user
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = await bcrypt.hash(password, 10);
  await user.save();

  return res.status(200).json(user);
});

export default router;
