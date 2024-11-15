import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from "../Model/User.js";

dotenv.config();

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.auth;

        if (!token) {
            return res.status(401).json({
                error: "No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET) ;
        if (decoded) {
            const userId = decoded.uid
            const user = await User.findById(userId)
            if (user.isAdmin) {
                next()
            }
        } else {
            return res.status(401).json({
                error: "Unauthorizrd"
            })
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
