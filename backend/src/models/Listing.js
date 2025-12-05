import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
{
title: { type: String, required: true, trim: true },
category: { type: String, enum: [
"grains", "vegetables", "fruits", "pulses", "spices", "oilseeds", "other"
], default: "other", index: true },
pricePerKg: { type: Number, required: true, min: 0 },
quantityKg: { type: Number, required: true, min: 0 },
images: { type: [String], default: [] },

// Reference to User model
farmer: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

// Simple location facets for filtering
location: {
district: { type: String, trim: true, index: true },
state: { type: String, trim: true, index: true },
pincode: { type: String, trim: true }
},

status: { type: String, enum: ["available", "reserved", "sold"], default: "available", index: true },
description: { type: String, trim: true }
},
{ timestamps: true }
);


// Text search on title + description
listingSchema.index({ title: "text", description: "text" });


export default mongoose.model("Listing", listingSchema);