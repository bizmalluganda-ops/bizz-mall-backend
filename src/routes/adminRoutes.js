import { getAdmin } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyIsAdmin } from "../middleware/vendorMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/me", verifyToken, verifyIsAdmin, getAdmin);

export default router;
