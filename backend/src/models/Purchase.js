import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    // Product being purchased
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: function() {
        return !this.listing; // Required if listing is not provided
      },
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: function() {
        return !this.product; // Required if product is not provided
      },
    },
    
    // Farmer who is selling
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Admin who is purchasing
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Purchase details
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "kg",
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
    
    // Notes
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);

