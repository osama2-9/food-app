import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from "../Model/User";

dotenv.config();

interface DecodedToken {
    uid: string;
}

export const isSuperAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies.auth;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        let decodedToken: DecodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.SECRET as string) as DecodedToken;
        } catch (error) {
            return res.status(401).json({
                error: "Invalid token"
            });
        }

        const uid = decodedToken.uid;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        if (user.isAdmin && user._id.toString() === process.env.SUPER_ADMIN) {
            return next();
        } else {
            return res.status(401).json({
                error: "Unauthorized to make changes"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};
