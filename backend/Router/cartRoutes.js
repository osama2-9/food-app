import { addItemToCart, getItems, removeItem } from "../Controllers/cartController.js";
import { Router } from "express";
import protectRoute from "../utils/protectRoute.js";

const cartRoute = Router()


cartRoute.post('/add-new-item', protectRoute, addItemToCart)
cartRoute.delete('/remove-items-in-cart/:userId/:itemId', protectRoute, removeItem)
cartRoute.get("/getItems/:userId", protectRoute, getItems)

export default cartRoute