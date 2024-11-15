import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DBconnect } from "./config/DBconnect.js";
import userRoute from './Router/userRoute.js'
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import restaurantRoute from "./Router/restaurantRoute.js";
import menuRoute from "./Router/menuRoutes.js";
import cartRoute from "./Router/cartRoutes.js";
import orderRoute from "./Router/orderRoutes.js";
import dashboardRoute from "./Router/dashboardRoutes.js";
import path from "path";
dotenv.config();

DBconnect();
const __dirname = path.resolve();
const PORT = Number(process.env.PORT) || 4000;
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
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));


app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Server work",
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDE_NAME,
  api_key: process.env.CLOUDE_API_KEY,
  api_secret: process.env.CLOUDE_API_SECRET,
});
app.use("/api/user", userRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/menu", menuRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/dashboard", dashboardRoute);
if (process.env.NODE_ENV === "production") {
  console.log("production test");

  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
