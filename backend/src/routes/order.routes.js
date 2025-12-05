import { Router } from "express";
import {
  createOrder,
  getConsumerOrders,
  getFarmerOrders,
  getAdminOrders,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Create order (consumer)
router.post("/", protect, authorize("consumer"), createOrder);

// Get consumer orders
router.get("/consumer", protect, authorize("consumer"), getConsumerOrders);

// Get farmer orders
router.get("/farmer", protect, authorize("farmer"), getFarmerOrders);

// Get admin orders (for admin's marketplace products)
router.get("/admin", protect, authorize("admin"), getAdminOrders);

// Get all orders (admin only)
router.get("/all", protect, authorize("admin"), getAllOrders);

// Get order details
router.get("/:id", protect, getOrderDetails);

// Update order status
router.patch("/:id/status", protect, updateOrderStatus);

export default router;




