import { Router } from "express";
import { UserModel } from "../models/user.model";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, friendId } = req.body;

  // Check if users exist
  const user = await UserModel.findById(userId);
  const friend = await UserModel.findById(friendId);
  if (!user || !friend) {
    return res.status(400).json({ message: "Invalid user or friend ID" });
  }

  // Add friend to user's friend list
  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId);
    await user.save();
  }

  // Add user to friend's friend list
  if (!friend.friends.includes(userId)) {
    friend.friends.push(userId);
    await friend.save();
  }

  return res.status(200).json({ message: "Friend added" });
});

router.delete("/", async (req, res) => {
  const { userId, friendId } = req.body;

  // Check if users exist
  const user = await UserModel.findById(userId);
  const friend = await UserModel.findById(friendId);
  if (!user || !friend) {
    return res.status(400).json({ message: "Invalid user or friend ID" });
  }

  // Remove friend from user's friend list
  user.friends = user.friends.filter(
    (id) => id.toString() !== friendId.toString()
  );
  await user.save();

  // Remove user from friend's friend list
  friend.friends = friend.friends.filter(
    (id) => id.toString() !== userId.toString()
  );
  await friend.save();

  return res.status(200).json({ message: "Friend removed" });
});

export default router;
