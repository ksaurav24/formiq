import mongoose, { Model } from "mongoose";

export interface IUser extends mongoose.Document { 
  googleId?: string;
  githubId?: string;
  email: string;
  avatarUrl?: string;
  provider: "google" | "github";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  { 
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatarUrl: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["google", "github"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// define the collection as user and not users
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema, "user");

export default User;