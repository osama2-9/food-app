import { Router } from "express";
import  { dashboardOverview,getRecentOrders, getTopRestaurtns } from "../services/dashboardService";
import { isAdmin } from "../utils/isAdmin";

const dashboardRoute: Router = Router()

dashboardRoute.get('/overview', isAdmin, dashboardOverview)
dashboardRoute.get("/getTopRestaurants", isAdmin, getTopRestaurtns)
dashboardRoute.get("/recentOrders", isAdmin, getRecentOrders)


export default dashboardRoute