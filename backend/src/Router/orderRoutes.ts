import { createNewOrder, getOrders } from "../Controllers/orderController";
import { Router } from "express";
import protectRoute from "../utils/protectRoute";
import { isAdmin } from "../utils/isAdmin";
const orderRoute: Router = Router()

orderRoute.post("/create-new-order", protectRoute, createNewOrder)
orderRoute.get('/orders-data', isAdmin, getOrders)

export default orderRoute