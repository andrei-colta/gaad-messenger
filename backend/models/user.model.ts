import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  friends: Array<string>;
  profilePicture: string;
  blacklist: Array<string>;
}

export const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    profilePicture: { type: String, default: null },
    blacklist: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', UserSchema);
