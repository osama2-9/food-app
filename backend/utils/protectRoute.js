import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET) ;
    if (decoded.uid) {
      next()
    }




  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        error: "Invalid token",
      });
    }
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export default protectRoute;
