import {
  addNewItem,
  deleteItem,
  getMenuItems,
} from "../Controllers/menuController";
import { Router } from "express";
const menuRoute: Router = Router();

menuRoute.post("/create", addNewItem);
menuRoute.get("/meals/:restaurantID", getMenuItems);
menuRoute.delete("/meals/delete", deleteItem);

export default menuRoute;
