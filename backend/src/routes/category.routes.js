import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Public route - get all categories
router.get("/", getCategories);

// Protected routes - admin only
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;


