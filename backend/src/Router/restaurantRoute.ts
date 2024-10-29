import {
  create,
  deleteRestaurant,
  getAllRestaurant,
  updateRestaurant,
} from "../Controllers/restaurantController";
import { Router } from "express";

const restaurantRoute: Router = Router();

restaurantRoute.post("/create", create);
restaurantRoute.delete("/delete", deleteRestaurant);
restaurantRoute.put("/update", updateRestaurant);
restaurantRoute.get("/get", getAllRestaurant);
export default restaurantRoute;
