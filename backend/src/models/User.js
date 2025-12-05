import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["farmer", "consumer", "admin"],
      default: "consumer",
      set: (value) => {
        if (value === undefined || value === null) return value;
        const normalized = String(value).trim().toLowerCase();
        if (normalized === "customer") return "consumer";
        if (["consumer", "farmer", "admin"].includes(normalized)) return normalized;
        return normalized; // let enum validator handle invalid values
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: "India" },
    },
    profileImage: {
      type: String,
      default: "",
    },
    // Reference to Image model (new approach)
    profileImageRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For farmers - Basic farm details
    farmDetails: {
      farmName: String,
      farmSize: String,
      crops: [String],
      certification: [String],
    },
    // Extended farmer profile fields
    farmerProfile: {
      farmName: String,
      description: String,
      farmingPractices: [String],
      establishedYear: String,
      socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
      },
      businessHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
      },
      acceptsPickup: { type: Boolean, default: false },
      acceptsDelivery: { type: Boolean, default: false },
      deliveryRadius: { type: Number, default: 0 },
    },
    // For consumers
    preferences: {
      categories: [String],
      location: {
        state: String,
        city: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
