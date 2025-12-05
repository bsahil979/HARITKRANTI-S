import { Router } from "express";
import {
  getAllPurchases,
  createPurchase,
  updatePurchaseStatus,
} from "../controllers/purchase.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// All routes require admin authentication
router.use(protect, authorize("admin"));

router.get("/", getAllPurchases);
router.post("/", createPurchase);
router.patch("/:id/status", updatePurchaseStatus);

export default router;




