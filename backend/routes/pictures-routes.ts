import { Router } from "express";
import multer from "multer";
import { UserModel } from "../models/user.model";

const router = Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  return res.status(200).json(user.profilePicture);
});

router.post("/:userId", upload.single("picture"), async (req, res) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  // Save new profile picture URL to user
  if (req.file) {
    user.profilePicture = req.file.path;
    await user.save();
  }

  return res.status(200).json({ message: "Profile picture set" });
});

export default router;
