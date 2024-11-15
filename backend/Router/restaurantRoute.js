import {
  create,
  deleteRestaurant,
  getAllRestaurant,
  getRestaurantDetails,
  updateRestaurant,
} from "../Controllers/restaurantController.js";
import { Router } from "express";
import { isAdmin } from "../utils/isAdmin.js";
import { isSuperAdmin } from "../utils/isSuperAdmin.js";

const restaurantRoute = Router();

restaurantRoute.post("/create", isAdmin, create);
restaurantRoute.delete("/delete", isSuperAdmin, deleteRestaurant);
restaurantRoute.put("/update", isAdmin, updateRestaurant);
restaurantRoute.get("/get", getAllRestaurant);
restaurantRoute.get("/details/:name", getRestaurantDetails);
export default restaurantRoute;
