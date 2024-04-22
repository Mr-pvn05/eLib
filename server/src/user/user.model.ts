import mongoose from "mongoose";
import { userType } from "./user.types.ts";

const userSchema = new mongoose.Schema<userType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<userType>("User", userSchema);
