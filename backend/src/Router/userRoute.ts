import { Router } from "express";
import { checkAuth, deleteUser, getAddressDetails, getAllUsers, login, logout, search, sendVerificationCode, signup, updateAdminStatus, updateProfile, verifyEmail } from "../Controllers/userController";
import protectRoute from "../utils/protectRoute";
import { isAdmin } from "../utils/isAdmin";
import { isSuperAdmin } from "../utils/isSuperAdmin";

const userRoute: Router = Router();
userRoute.get('/protected', checkAuth)
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post('/logout', logout)
userRoute.delete('/delete-user', isSuperAdmin, deleteUser)
userRoute.put("/update-profile", protectRoute, updateProfile)
userRoute.get("/get", isAdmin, getAllUsers)
userRoute.post("/send-verification-code", protectRoute, sendVerificationCode)
userRoute.post('/verify-email', protectRoute, verifyEmail)
userRoute.get("/search", search)
userRoute.post("/updateAdminStatus", isSuperAdmin, updateAdminStatus)
userRoute.get("/user-address/:uid", protectRoute, getAddressDetails)

export default userRoute;
