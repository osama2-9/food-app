import { Router } from "express";
import  { dashboardOverview,getRecentOrders, getTopRestaurtns } from "../services/dashboardService.js";
import { isAdmin } from "../utils/isAdmin.js";

const dashboardRoute = Router()

dashboardRoute.get('/overview', isAdmin, dashboardOverview)
dashboardRoute.get("/getTopRestaurants", isAdmin, getTopRestaurtns)
dashboardRoute.get("/recentOrders", isAdmin, getRecentOrders)


export default dashboardRoute