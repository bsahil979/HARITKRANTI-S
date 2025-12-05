import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    // Notification type
    type: {
      type: String,
      enum: [
        "order_placed",
        "order_accepted",
        "order_rejected",
        "order_completed",
        "order_cancelled",
        "purchase_completed",
        "inventory_low",
        "product_listed",
      ],
      required: true,
    },
    
    // Title
    title: {
      type: String,
      required: true,
    },
    
    // Message
    message: {
      type: String,
      required: true,
    },
    
    // Related entity (order, purchase, etc.)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    
    // Related entity type
    relatedType: {
      type: String,
      enum: ["order", "purchase", "inventory", "product"],
    },
    
    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // Link (optional)
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for unread notifications
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);




