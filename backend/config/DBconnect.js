import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "";

export const DBconnect = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log('connected');

  } catch (err) {
    if (err instanceof Error) {
      console.error("Error connecting to MongoDB:", err.message);
    } else {
      console.error("Unexpected error connecting to MongoDB:", err);
    }
  }
};
