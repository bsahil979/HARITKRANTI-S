import { Router } from "express";
import {
  uploadImage,
  uploadMultipleImages,
  getImage,
  getUserImages,
  getImagesByReference,
  deleteImage,
  updateImageReference,
} from "../controllers/image.controller.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = Router();

// Upload single image
router.post(
  "/upload",
  protect,
  upload.single("image"),
  uploadImage
);

// Upload multiple images
router.post(
  "/upload-multiple",
  protect,
  upload.array("images", 10), // Max 10 images
  uploadMultipleImages
);

// Get user images (current user)
router.get("/user", protect, getUserImages);

// Get user images by userId
router.get("/user/:userId", protect, getUserImages);

// Get image by ID
router.get("/:id", getImage);

// Get images by reference
router.get("/reference/:model/:id", getImagesByReference);

// Update image reference
router.patch("/:id/reference", protect, updateImageReference);

// Delete image
router.delete("/:id", protect, deleteImage);

export default router;


