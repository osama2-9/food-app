import { addItemToCart, getItems, removeItem } from "../Controllers/cartController";
import { Router } from "express";
import protectRoute from "../utils/protectRoute";

const cartRoute: Router = Router()


cartRoute.post('/add-new-item', protectRoute, addItemToCart)
cartRoute.delete('/remove-items-in-cart/:userId/:itemId', protectRoute, removeItem)
cartRoute.get("/getItems/:userId", protectRoute, getItems)

export default cartRoute