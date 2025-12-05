import mongoose from "mongoose";
import Listing from "../models/Listing.js";

export async function createListing(req, res, next) {
  try {
    const body = req.body;
    if (!body?.title || !body?.pricePerKg || !body?.quantityKg) {
      return res.status(400).json({ message: "title, pricePerKg, quantityKg are required" });
    }
    
    // Add farmer ID from authenticated user
    body.farmer = req.user._id;
    
    const doc = await Listing.create(body);
    await doc.populate('farmer', 'name email phone');
    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function listListings(req, res, next) {
  try {
    const { page = 1, limit = 12, q, category, minPrice, maxPrice, state, district, status, farmer, sort = "-createdAt" } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (farmer) filter.farmer = farmer; // Filter by farmer ID
    if (state) filter["location.state"] = state;
    if (district) filter["location.district"] = district;
    if (minPrice || maxPrice) {
      filter.pricePerKg = {};
      if (minPrice) filter.pricePerKg.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerKg.$lte = Number(maxPrice);
    }
    
    console.log("Products filter:", filter);
    console.log("Farmer ID filter:", farmer);
    
    const query = Listing.find(filter).populate('farmer', 'name email phone').sort(sort).skip((+page - 1) * +limit).limit(+limit);
    const [data, total] = await Promise.all([query, Listing.countDocuments(filter)]);
    res.json({ data, total, page: +page, limit: +limit });
  } catch (e) { next(e); }
}

export async function getListing(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });
    const doc = await Listing.findById(id).populate('farmer', 'name email phone');
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function updateListing(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });
    const doc = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function deleteListing(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });
    const doc = await Listing.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", id });
  } catch (e) { next(e); }
}

export async function getFarmerListings(req, res, next) {
  try {
    const { page = 1, limit = 12 } = req.query;
    const filter = { farmer: req.user._id };
    const query = Listing.find(filter).sort("-createdAt").skip((+page - 1) * +limit).limit(+limit);
    const [data, total] = await Promise.all([query, Listing.countDocuments(filter)]);
    res.json({ data, total, page: +page, limit: +limit });
  } catch (e) { next(e); }
}
