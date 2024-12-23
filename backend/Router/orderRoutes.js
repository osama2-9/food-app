import {
  createNewOrder,
  getOrders,
  getUserOrder,
  onlinePaymentTEST,
  orderRating,
} from "../Controllers/orderController.js";
import { Router } from "express";
import protectRoute from "../utils/protectRoute.js";
import { isAdmin } from "../utils/isAdmin.js";
const orderRoute = Router();

orderRoute.post("/create-new-order", protectRoute, createNewOrder);
orderRoute.get("/get-orders-data", isAdmin, getOrders);
orderRoute.get("/userOrders/:userId", protectRoute, getUserOrder);
orderRoute.post("/rate/:orderId", protectRoute, orderRating);
orderRoute.post("/online-payment", protectRoute, onlinePaymentTEST);

export default orderRoute;
