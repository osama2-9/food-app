import express from "express";
import { isAdmin } from "../utils/isAdmin.js";
import {
  createOffer,
  deleteOffer,
  getAllOffer,
  getRestaurntOffers,
  updateActivicationStatus,
  updateOffer,
} from "../Controllers/offerController.js";
const offerRoute = express.Router();

offerRoute.post("/create", isAdmin, createOffer);
offerRoute.get("/get-offers", getAllOffer);
offerRoute.put("/update-status", isAdmin, updateActivicationStatus);
offerRoute.delete("/delete-offer/:offerId", isAdmin, deleteOffer);
offerRoute.put("/update-offer", isAdmin, updateOffer);
offerRoute.get("/get-restaurnt-offers/:restaurntId", getRestaurntOffers);
export default offerRoute;
