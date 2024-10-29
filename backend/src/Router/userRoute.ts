import { Router } from "express";
import { getAllUsers, login, logout, sendVerificationCode, signup, updateProfile, verifyEmail } from "../Controllers/userController";
import protectRoute from "../utils/protectRoute";
import { isAdmin } from "../utils/isAdmin";
import { checkAuth } from "../utils/checkAuth";

const userRoute: Router = Router();
userRoute.get('/protected', checkAuth)
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post('/logout',logout)
userRoute.put("/update-profile", protectRoute, updateProfile)
userRoute.get("/get", isAdmin, getAllUsers)
userRoute.post("/send-verification-code", protectRoute, sendVerificationCode)
userRoute.post('/verify-email', protectRoute, verifyEmail)

export default userRoute;
