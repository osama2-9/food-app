import express from "express";
import { isAdmin } from "../utils/isAdmin.js";
import { createOffer } from "../Controllers/offerController.js";
const offerRoute = express.Router();

offerRoute.post("/create", isAdmin, createOffer);

export default offerRoute;
