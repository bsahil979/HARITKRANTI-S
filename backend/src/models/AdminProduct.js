import mongoose from "mongoose";

const adminProductSchema = new mongoose.Schema(
  {
    // Admin who is selling
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Reference to inventory item
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    
    // Product details for marketplace
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    
    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerKg: {
      type: Number,
      min: 0,
    },
    
    // Available quantity
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "kg",
    },
    
    // Status
    status: {
      type: String,
      enum: ["available", "out_of_stock", "archived"],
      default: "available",
    },
    
    // Admin-specific fields
    isAdminProduct: {
      type: Boolean,
      default: true,
    },
    adminMarkup: {
      type: Number,
      default: 0,
    },
    
    // Location
    location: {
      state: String,
      city: String,
      district: String,
    },
  },
  { timestamps: true }
);

// Indexes
adminProductSchema.index({ admin: 1, status: 1 });
adminProductSchema.index({ category: 1 });
adminProductSchema.index({ isAdminProduct: 1 });

export default mongoose.model("AdminProduct", adminProductSchema);




