import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "";
let isConnected = false; 

export const DBconnect = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error connecting to MongoDB:", err.message);
    } else {
      console.error("Unexpected error connecting to MongoDB:", err);
    }
  }
};
