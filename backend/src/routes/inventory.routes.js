import { Router } from "express";
import {
  getAllInventory,
  getInventoryItem,
  updateInventory,
  listProductInMarketplace,
  getAllAdminProducts,
} from "../controllers/inventory.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public route for marketplace (admin products) - must be before admin routes
router.get("/marketplace/products", getAllAdminProducts);

// Admin routes (require authentication)
router.use(protect, authorize("admin"));
router.get("/", getAllInventory);
router.get("/:id", getInventoryItem);
router.patch("/:id", updateInventory);
router.post("/list", listProductInMarketplace);

export default router;

