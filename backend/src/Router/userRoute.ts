import { Router } from "express";
import { checkAuth, deleteUser, getAllUsers, login, logout, sendVerificationCode, signup, updateProfile, verifyEmail } from "../Controllers/userController";
import protectRoute from "../utils/protectRoute";
import { isAdmin } from "../utils/isAdmin";

const userRoute: Router = Router();
userRoute.get('/protected', checkAuth)
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post('/logout', logout)
userRoute.delete('/delete-user', isAdmin, deleteUser)
userRoute.put("/update-profile", protectRoute, updateProfile)
userRoute.get("/get", isAdmin, getAllUsers)
userRoute.post("/send-verification-code", protectRoute, sendVerificationCode)
userRoute.post('/verify-email', protectRoute, verifyEmail)

export default userRoute;
