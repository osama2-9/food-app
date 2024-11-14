import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DBconnect } from "./config/DBconnect";
import userRoute from "./Router/userRoute";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import restaurantRoute from "./Router/restaurantRoute";
import menuRoute from "./Router/menuRoutes";
import cartRoute from "./Router/cartRoutes";
import orderRoute from "./Router/orderRoutes";
import dashboardRoute from "./Router/dashboardRoutes";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 4000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "content-type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  }),

);

app.use(cookieParser());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

DBconnect();
app.get('/' ,(req:any ,res:any)=>{
res.json({
  "server test"
})
})

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUDE_API_KEY,
  api_secret: process.env.CLOUDE_API_SECRET,
});
app.use("/api/user", userRoute);
app.use('/api/restaurant', restaurantRoute)
app.use('/api/menu', menuRoute);
app.use('/api/cart', cartRoute)
app.use('/api/order', orderRoute)
app.use("/api/dashboard", dashboardRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
