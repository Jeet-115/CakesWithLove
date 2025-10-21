import express from "express";
import {
  getCakes,
  getCategories,
  getCakesByCategory,
  addCake,
  updateCake,
  deleteCake,
} from "../controllers/cakeController.js";

import parser from "../utils/upload.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getCakes);
router.get("/categories", getCategories);
router.get("/category/:category", getCakesByCategory);

// Admin routes (protected)
router.post("/", protectAdmin, parser.single("image"), addCake);
router.put("/:id", protectAdmin, parser.single("image"), updateCake);
router.delete("/:id", protectAdmin, deleteCake);

export default router;
