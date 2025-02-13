import {
  acceptOrder,
  checkRestaurantAuthuntication,
  create,
  deleteRestaurant,
  getAllRestaurant,
  getRestaurantAnalystic,
  getRestaurantDetails,
  getRestaurantOrders,
  login,
  logout,
  updateRestaurant,
} from "../Controllers/restaurantController.js";
import { Router } from "express";
import { isAdmin } from "../utils/isAdmin.js";
import { isSuperAdmin } from "../utils/isSuperAdmin.js";

const restaurantRoute = Router();

restaurantRoute.get("/isAuthnticated", checkRestaurantAuthuntication);
restaurantRoute.post("/create", isAdmin, create);
restaurantRoute.delete("/delete", isSuperAdmin, deleteRestaurant);
restaurantRoute.put("/update", isAdmin, updateRestaurant);
restaurantRoute.get("/get", getAllRestaurant);
restaurantRoute.get("/details/:name", getRestaurantDetails);
restaurantRoute.get("/analystic/:rid", getRestaurantAnalystic);
restaurantRoute.get("/orders-details/:rid", getRestaurantOrders);
restaurantRoute.put("/accept-order", acceptOrder);
restaurantRoute.post("/login", login);
restaurantRoute.post("/logout", logout);
export default restaurantRoute;
