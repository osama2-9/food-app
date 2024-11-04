import {
  addNewItem,
  deleteItem,
  getMenuItems,
  mealDetailes,
} from "../Controllers/menuController";
import { Router } from "express";
const menuRoute: Router = Router();

menuRoute.post("/create", addNewItem);
menuRoute.get("/meals/:restaurantID", getMenuItems);
menuRoute.delete("/meals/delete", deleteItem);
menuRoute.get('/meal/:mealId' , mealDetailes)

export default menuRoute;
