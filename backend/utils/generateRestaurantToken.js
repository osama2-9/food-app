import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateRestaurantToken = (rid, res) => {
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      throw new Error("SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ rid }, secret, {
      expiresIn: "120d",
    });

    res.cookie("rauth", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 120,
      secure: true,
      sameSite: "None",
    });

   
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send("Error generating token.");
  }
};

export default generateRestaurantToken;
