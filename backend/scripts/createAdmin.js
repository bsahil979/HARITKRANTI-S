import mongoose from "mongoose";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { getMongoUri } from "../src/utils/mongoUri.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // MongoDB connection string
    const MONGODB_URI = getMongoUri();
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@test.com" }).select("+password");
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Updating password...");
      
      // Update password - use direct update to bypass pre-save hook
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await User.updateOne(
        { email: "admin@test.com" },
        { 
          $set: { 
            password: hashedPassword,
            role: "admin",
            isActive: true
          } 
        }
      );
      
      console.log("✅ Admin password updated!");
      console.log("Email: admin@test.com");
      console.log("Password: admin123");
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
    
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@test.com");
    console.log("Password: admin123");
    console.log("⚠️  Please change the password after first login!");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

