import { Router } from "express";
import { UserModel } from "../models/user.model";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, blockedUserId } = req.body;

  // Check if users exist
  const user = await UserModel.findById(userId);
  const blockedUser = await UserModel.findById(blockedUserId);
  if (!user || !blockedUser) {
    return res.status(400).json({ message: "Invalid user or blocked user ID" });
  }

  // Add blocked user to user's blacklist
  if (!user.blacklist.includes(blockedUserId)) {
    user.blacklist.push(blockedUserId);
    await user.save();
  }

  return res.status(200).json({ message: "User blocked" });
});

router.delete("/", async (req, res) => {
  const { userId, unblockedUserId } = req.body;

  // Check if users exist
  const user = await UserModel.findById(userId);
  const unblockedUser = await UserModel.findById(unblockedUserId);
  if (!user || !unblockedUser) {
    return res
      .status(400)
      .json({ message: "Invalid user or unblocked user ID" });
  }

  // Remove unblocked user from user's blacklist
  user.blacklist = user.blacklist.filter(
    (id) => id.toString() !== unblockedUserId.toString()
  );
  await user.save();

  return res.status(200).json({ message: "User unblocked" });
});

export default router;
