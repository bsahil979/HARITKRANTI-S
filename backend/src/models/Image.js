import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    // Image data - can be URL (Cloudinary) or base64 string
    url: {
      type: String,
      required: true,
    },
    
    // Image type: 'url' (Cloudinary/external) or 'base64' (stored in DB)
    storageType: {
      type: String,
      enum: ["url", "base64"],
      default: "url",
    },
    
    // Image metadata
    filename: {
      type: String,
      trim: true,
    },
    mimeType: {
      type: String,
      default: "image/jpeg",
    },
    size: {
      type: Number, // Size in bytes
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    
    // Image category/type
    imageType: {
      type: String,
      enum: ["profile", "product", "farm", "certificate", "other"],
      default: "other",
      index: true,
    },
    
    // Owner/Uploader
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    
    // Reference to what uses this image
    // For profile images: references User._id
    // For product images: references Product._id
    referencedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referencedModel",
    },
    referencedModel: {
      type: String,
      enum: ["User", "Product", "AdminProduct", "Inventory"],
    },
    
    // Cloudinary specific (if using Cloudinary)
    cloudinaryId: {
      type: String,
    },
    cloudinaryUrl: {
      type: String,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Thumbnail URL (if generated)
    thumbnailUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
imageSchema.index({ uploadedBy: 1, imageType: 1 });
imageSchema.index({ referencedBy: 1, referencedModel: 1 });
imageSchema.index({ isActive: 1 });

// Virtual to get the display URL
imageSchema.virtual("displayUrl").get(function() {
  if (this.storageType === "url") {
    return this.cloudinaryUrl || this.url;
  }
  // For base64, return the data URL
  if (this.url.startsWith("data:")) {
    return this.url;
  }
  return `data:${this.mimeType};base64,${this.url}`;
});

// Ensure virtuals are included in JSON
imageSchema.set("toJSON", { virtuals: true });
imageSchema.set("toObject", { virtuals: true });

export default mongoose.model("Image", imageSchema);




