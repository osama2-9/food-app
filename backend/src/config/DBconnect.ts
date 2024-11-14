import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl: string = process.env.MONGO_URL || "";

export const DBconnect = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log('connected');

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error connecting to MongoDB:", err.message);
    } else {
      console.error("Unexpected error connecting to MongoDB:", err);
    }
  }
};
