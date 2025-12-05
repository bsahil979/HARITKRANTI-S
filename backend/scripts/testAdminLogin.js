import mongoose from "mongoose";
import User from "../src/models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { getMongoUri } from "../src/utils/mongoUri.js";

dotenv.config();

const testAdminLogin = async () => {
  try {
    const MONGODB_URI = getMongoUri();
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    
    const user = await User.findOne({ email: "admin@test.com" }).select("+password");
    
    if (!user) {
      console.log("❌ Admin user not found!");
      await mongoose.disconnect();
      process.exit(1);
    }
    
    console.log("\n📋 Admin Account Details:");
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log("IsActive:", user.isActive);
    console.log("Password hash exists:", !!user.password);
    
    // Test password
    const testPassword = "admin123";
    const isMatch = await user.comparePassword(testPassword);
    
    console.log("\n🔐 Password Test:");
    console.log("Testing password: 'admin123'");
    console.log("Password matches:", isMatch ? "✅ YES" : "❌ NO");
    
    if (!isMatch) {
      console.log("\n⚠️  Password doesn't match! Resetting password...");
      const hashedPassword = await bcrypt.hash(testPassword, 12);
      user.password = hashedPassword;
      await user.save();
      console.log("✅ Password reset successfully!");
      
      // Test again
      const isMatchAfter = await user.comparePassword(testPassword);
      console.log("Password matches after reset:", isMatchAfter ? "✅ YES" : "❌ NO");
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testAdminLogin();




