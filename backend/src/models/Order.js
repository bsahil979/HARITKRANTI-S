import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Consumer who placed the order
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Seller (can be farmer or admin)
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Seller type
    sellerType: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },
    
    // Order items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        adminProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AdminProduct",
        },
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
        name: String,
        quantity: { type: Number, required: true, min: 0 },
        price: { type: Number, required: true, min: 0 },
        unit: { type: String, default: "kg" },
      },
    ],
    
    // Order details
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Status
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    
    // Delivery/Pickup details
    orderType: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "delivery",
    },
    
    pickupDetails: {
      date: String,
      time: String,
      location: String,
    },
    
    deliveryDetails: {
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
      date: String,
      time: String,
    },
    
    // Payment
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "card"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
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

// Indexes
orderSchema.index({ consumer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ sellerType: 1 });

export default mongoose.model("Order", orderSchema);




