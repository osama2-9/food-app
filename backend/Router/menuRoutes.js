import {
  addNewItem,
  deleteItem,
  getAllMenu,
  getMenuItems,
  getOffers,
  mealDetailes,
  offerActivationStatus,
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
menuRoute.get('/get-offers' ,isAdmin,getOffers)
menuRoute.put("/update-status",isAdmin,offerActivationStatus);
export default menuRoute;
