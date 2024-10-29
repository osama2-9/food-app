import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const secret = process.env.SECRET;
export const generateToken = (uid: string, res: express.Response) => {
  try {
    const token = jwt.sign({ uid }, process.env.SECRET, {
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