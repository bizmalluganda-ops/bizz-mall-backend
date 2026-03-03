import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoues from "./routes/adminRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://bizz-mall.vercel.app",
];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/admin", adminRoues);

sequelize
  .sync({ alter: true })
  .then(console.log("Db conected and synced succesfully"));
app.listen(3001, () => {
  console.log("Listening on port 3001");
});
