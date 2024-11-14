import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

export const generateToken = (uid: string, res: express.Response) => {
  try {
    // Ensure SECRET is defined
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ uid }, secret, {
      expiresIn: "1d",
    });

    res.cookie("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
  }
};
