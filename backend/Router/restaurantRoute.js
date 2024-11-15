import {
  create,
  deleteRestaurant,
  getAllRestaurant,
  getRestaurantDetails,
  updateRestaurant,
} from "../Controllers/restaurantController.js";
import { Router } from "express";

const restaurantRoute = Router();

restaurantRoute.post("/create", create);
restaurantRoute.delete("/delete", deleteRestaurant);
restaurantRoute.put("/update", updateRestaurant);
restaurantRoute.get("/get", getAllRestaurant);
restaurantRoute.get("/details/:name", getRestaurantDetails);
export default restaurantRoute;
