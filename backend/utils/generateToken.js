import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (uid, res) => {
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ uid }, secret, {
      expiresIn: "1d",
    });

    res.cookie("auth", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      secure: true,
      sameSite: "None",
    });
    req.userId = uid;

    return token;
  } catch (error) {
    console.error("Token generation error:", error);
  }
};
