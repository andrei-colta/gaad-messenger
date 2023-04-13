import { Schema, Document, model } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  receiverId: string;
  content: string;
  isEncrypted: boolean;
}

export const MessageSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isEncrypted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessage>('Message', MessageSchema);
