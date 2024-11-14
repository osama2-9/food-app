import { createNewOrder, getOrders, getUserOrder, orderRating } from "../Controllers/orderController";
import { Router } from "express";
import protectRoute from "../utils/protectRoute";
import { isAdmin } from "../utils/isAdmin";
const orderRoute: Router = Router()

orderRoute.post("/create-new-order", protectRoute, createNewOrder)
orderRoute.get('/get-orders-data', isAdmin, getOrders)
orderRoute.get("/userOrders/:userId", protectRoute, getUserOrder)
orderRoute.post("/rate/:orderId", protectRoute, orderRating)


export default orderRoute