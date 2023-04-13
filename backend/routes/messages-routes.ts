import { Router } from "express";
import { MessageModel } from "../models/message.model";
import { UserModel } from "../models/user.model";

const router = Router();

router.get("/", async (req, res) => {
  const { userId, recipientId } = req.query;

  // Check if users exist
  const user = await UserModel.findById(userId);
  const recipient = await UserModel.findById(recipientId);
  if (!user || !recipient) {
    return res.status(400).json({ message: "Invalid user or recipient ID" });
  }

  // Get messages between user and recipient
  const messages = await MessageModel.find({
    $or: [
      { sender: userId, recipient: recipientId },
      { sender: recipientId, recipient: userId },
    ],
  });

  return res.status(200).json(messages);
});

router.post("/", async (req, res) => {
  const { senderId, recipientId, content } = req.body;

  // Check if users exist
  const sender = await UserModel.findById(senderId);
  const recipient = await UserModel.findById(recipientId);
  if (!sender || !recipient) {
    return res.status(400).json({ message: "Invalid sender or recipient ID" });
  }

  // Create message
  const message = new MessageModel({
    sender: senderId,
    recipient: recipientId,
    content,
  });
  await message.save();

  return res.status(200).json({ message: "Message sent" });
});

export default router;
