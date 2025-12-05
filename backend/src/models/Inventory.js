import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    // Admin who owns this inventory
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Original purchase reference
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
    
    // Product details (copied from purchase)
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
    
    // Inventory quantities
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      default: "kg",
    },
    
    // Pricing
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Source information
    sourceFarmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sourceProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    
    // Status
    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "listed", "archived"],
      default: "in_stock",
    },
    
    // Location
    warehouseLocation: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for efficient queries
inventorySchema.index({ admin: 1, status: 1 });
inventorySchema.index({ category: 1 });

export default mongoose.model("Inventory", inventorySchema);




