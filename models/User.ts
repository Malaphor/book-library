import mongoose, { Document, Schema } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  password: string;
  username: string;
  accessToken: string;
  currentlyReading: { id: typeof Schema.ObjectId; page: number }[];
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  accessToken: { type: String },
  currentlyReading: {
    type: [{ id: Schema.ObjectId, page: Number }],
    default: [],
  },
});

const User =
  mongoose.models.User || mongoose.model<UserInterface>("User", userSchema);

export default User;
