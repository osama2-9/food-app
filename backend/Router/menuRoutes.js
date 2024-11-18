import {
  addNewItem,
  deleteItem,
  getAllMenu,
  getMenuItems,
  mealDetailes,
  updateMeal,
} from "../Controllers/menuController.js";
import { isAdmin } from "../utils/isAdmin.js";
import { Router } from "express";
const menuRoute = Router();

menuRoute.post("/create", isAdmin, addNewItem);
menuRoute.get("/meals/:restaurantID", getMenuItems);
menuRoute.delete("/meals/delete/:_id", isAdmin, deleteItem);
menuRoute.get("/meal/:mealId", mealDetailes);
menuRoute.get("/meals", isAdmin, getAllMenu);
menuRoute.post("/update-meal", isAdmin, updateMeal);

export default menuRoute;
