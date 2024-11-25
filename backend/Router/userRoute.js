import { Router } from "express";
import {
  accountActivetion,
  checkAuth,
  checkTokenValidity,
  deactiveAccount,
  deleteUser,
  getAddressDetails,
  getAllUsers,
  login,
  logout,
  picksForYou,
  resetPassword,
  search,
  sendActivationMail,
  sendResetPasswordMail,
  sendVerificationCode,
  signup,
  updateAddress,
  updateAdminStatus,
  updateProfile,
  verifyEmail,
} from "../Controllers/userController.js";
import protectRoute from "../utils/protectRoute.js";
import { isAdmin } from "../utils/isAdmin.js";
import { isSuperAdmin } from "../utils/isSuperAdmin.js";

const userRoute = Router();

userRoute.get("/protected", checkAuth);
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.delete("/delete-user", isSuperAdmin, deleteUser);
userRoute.put("/update-profile", protectRoute, updateProfile);
userRoute.get("/get", isAdmin, getAllUsers);
userRoute.post("/send-verification-code", protectRoute, sendVerificationCode);
userRoute.post("/verify-email", protectRoute, verifyEmail);
userRoute.get("/search", search);
userRoute.post("/updateAdminStatus", isSuperAdmin, updateAdminStatus);
userRoute.get("/user-address/:uid", protectRoute, getAddressDetails);
userRoute.get("/picks-for-you/:userId", protectRoute, picksForYou);
userRoute.put("/update-address", protectRoute, updateAddress);
userRoute.post("/forget-password", sendResetPasswordMail);
userRoute.get("/check-token-validity/:token", checkTokenValidity);
userRoute.post("/reset-password/", resetPassword);
userRoute.post("/deactive-account", protectRoute, deactiveAccount);
userRoute.post("/send-activetion-email", sendActivationMail);
userRoute.get("/reactivate-account/:token", accountActivetion);

export default userRoute;
