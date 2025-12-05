import { Router } from "express";
import {
createListing,
listListings,
getListing,
updateListing,
deleteListing,
getFarmerListings
} from "../controllers/listing.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/", listListings); // GET /api/listings
router.get("/:id", getListing); // GET /api/listings/:id

// Protected routes
router.get("/farmer/me", protect, authorize("farmer"), getFarmerListings);
router.post("/", protect, authorize("farmer"), createListing); // POST /api/listings
router.patch("/:id", protect, authorize("farmer"), updateListing); // PATCH /api/listings/:id
router.delete("/:id", protect, authorize("farmer"), deleteListing);// DELETE /api/listings/:id

export default router;