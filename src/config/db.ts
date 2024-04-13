import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Mongodb connected");
    });
    mongoose.connection.on("error", (error) => {
      console.log("Error in connecting to databse.", error);
    });
    await mongoose.connect(config.MONGODB_URI as string);
  } catch (error) {
    console.error("Failed to connect to database.", error);
    process.exit(1);
  }
};

export default connectDB;
