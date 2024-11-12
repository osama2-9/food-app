import { Router } from "express";
import dashboardOverview from "../services/dashboardService";
import { isAdmin } from "../utils/isAdmin";

const dashboardRoute: Router = Router()

dashboardRoute.get('/overview', isAdmin, dashboardOverview)


export default dashboardRoute