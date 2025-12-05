import { Router } from "express";
import {
  getCropRecommendations,
  getRecommendationHistory,
} from "../controllers/cropRecommendation.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Get crop recommendations (public, but can save if authenticated)
router.post("/recommend", getCropRecommendations);

// Get recommendation history (protected)
router.get("/history", protect, getRecommendationHistory);

export default router;

