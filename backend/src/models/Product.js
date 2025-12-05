import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic product info
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // Alias for name (for compatibility)
    description: { type: String, default: "" },
    
    // Pricing - support both price and pricePerKg
    price: { type: Number, min: 0 },
    pricePerKg: { type: Number, min: 0 },
    
    // Quantity - support both quantity and quantityKg
    quantity: { type: Number, min: 0 },
    quantityKg: { type: Number, min: 0 },
    quantityAvailable: { type: Number, min: 0 }, // Available quantity
    
    // Unit
    unit: { type: String, default: "kg" },
    
    // Category - support both ObjectId reference and string enum for backward compatibility
    category: { 
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true,
      validate: {
        validator: function(v) {
          // Allow ObjectId (reference to Category model)
          if (mongoose.Types.ObjectId.isValid(v)) return true;
          // Allow string enum values for backward compatibility
          const validEnums = ["grains", "vegetables", "fruits", "pulses", "spices", "oilseeds", "other"];
          return typeof v === "string" && validEnums.includes(v.toLowerCase());
        },
        message: "Category must be a valid category ID or enum value"
      }
    },
    // Category reference (for population)
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    
    // Images - support both single imageUrl and multiple images
    imageUrl: { type: String }, // Single image (for backward compatibility)
    images: { type: [String], default: [] }, // Multiple images (URLs/base64 for backward compatibility)
    // References to Image model (new approach)
    imageRefs: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Image",
      default: [],
    },
    
    // Farmer reference
    farmerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    farmer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }, // Alias for farmerId (for compatibility)
    
    // Location (from Listing model)
    location: {
      district: { type: String, trim: true, index: true },
      state: { type: String, trim: true, index: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },
    
    // Status
    status: { 
      type: String, 
      enum: ["available", "reserved", "sold", "out_of_stock", "pending"], 
      default: "pending",
      index: true 
    },
    // Marketplace listing status - only approved products appear in marketplace
    isListed: {
      type: Boolean,
      default: false,
      index: true
    },
    // Admin-approved price (can be different from farmer's suggested price)
    approvedPrice: {
      type: Number,
      min: 0
    },
  },
  { timestamps: true }
);

// Text search on name/title + description
productSchema.index({ name: "text", title: "text", description: "text" });

// Virtual to get the effective price
productSchema.virtual("effectivePrice").get(function() {
  return this.pricePerKg || this.price || 0;
});

// Virtual to get the effective quantity
productSchema.virtual("effectiveQuantity").get(function() {
  return this.quantityAvailable || this.quantityKg || this.quantity || 0;
});

// Virtual to get the first image
productSchema.virtual("firstImage").get(function() {
  if (this.images && this.images.length > 0) return this.images[0];
  return this.imageUrl || "";
});

// Ensure virtuals are included in JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Pre-save middleware to sync fields
productSchema.pre("save", function(next) {
  // Sync name and title
  if (this.name && !this.title) this.title = this.name;
  if (this.title && !this.name) this.name = this.title;
  
  // Sync farmerId and farmer
  if (this.farmerId && !this.farmer) this.farmer = this.farmerId;
  if (this.farmer && !this.farmerId) this.farmerId = this.farmer;
  
  // Sync price and pricePerKg
  if (this.price && !this.pricePerKg) this.pricePerKg = this.price;
  if (this.pricePerKg && !this.price) this.price = this.pricePerKg;
  
  // Sync quantity fields
  if (this.quantity && !this.quantityKg) this.quantityKg = this.quantity;
  if (this.quantityKg && !this.quantity) this.quantity = this.quantityKg;
  if (!this.quantityAvailable) {
    this.quantityAvailable = this.quantityKg || this.quantity || 0;
  }
  
  // Sync images
  if (this.imageUrl && (!this.images || this.images.length === 0)) {
    this.images = [this.imageUrl];
  }
  if (this.images && this.images.length > 0 && !this.imageUrl) {
    this.imageUrl = this.images[0];
  }
  
  // Handle category - if ObjectId, set categoryRef; if string, keep as is
  if (this.category && mongoose.Types.ObjectId.isValid(this.category)) {
    this.categoryRef = this.category;
  } else if (!this.category) {
    this.category = "other"; // Default fallback
  }
  
  next();
});

export default mongoose.model("Product", productSchema);



