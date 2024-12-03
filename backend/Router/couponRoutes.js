import express from "express";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getCoupons,
  sendCoupons,
  updateCoupon,
} from "../Controllers/couponController.js";
import { isAdmin } from "../utils/isAdmin.js";
import { isSuperAdmin } from "../utils/isSuperAdmin.js";
import protectRoute from "../utils/protectRoute.js";
const couponRoute = express.Router();

couponRoute.post("/create", isAdmin, createCoupon);
couponRoute.post("/send-coupons", isAdmin, sendCoupons);
couponRoute.delete("/delete/:couponId", isSuperAdmin, deleteCoupon);
couponRoute.get("/get", isAdmin, getCoupons);
couponRoute.post("/apply", protectRoute, applyCoupon);
couponRoute.put("/update", isAdmin, updateCoupon);
export default couponRoute;
