import { Router } from "express";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";
import { 
  createProduct, 
  listProducts, 
  getProduct, 
  updateProduct, 
  deleteProduct,
  getFarmerProducts,
  approveProduct
} from "../controllers/product.controller.js";

const router = Router();

// Public routes (with optional auth so admin can see all products)
router.get("/", optionalAuth, listProducts);
router.get("/:id", getProduct);

// Protected routes
router.get("/farmer/me", protect, authorize("farmer"), getFarmerProducts);
router.post("/", protect, authorize("farmer"), upload.single("image"), createProduct);
router.patch("/:id", protect, authorize("farmer", "admin"), updateProduct);
router.put("/:id/approve", protect, authorize("admin"), approveProduct); // More specific route first
router.put("/:id", protect, authorize("farmer", "admin"), updateProduct); // Support PUT for frontend compatibility
router.delete("/:id", protect, authorize("farmer", "admin"), deleteProduct);

export default router;



