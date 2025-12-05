import mongoose from "mongoose";
import Product from "../src/models/Product.js";
import dotenv from "dotenv";
import { getMongoUri } from "../src/utils/mongoUri.js";

dotenv.config();

let MONGODB_URI;
try {
  MONGODB_URI = getMongoUri();
} catch (error) {
  console.error(error.message);
  console.error("Please set MONGODB_URI in your environment variables");
  process.exit(1);
}

async function migrateProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Update all existing products that don't have isListed field to be listed
    // This provides backward compatibility for products created before the approval workflow
    const result = await Product.updateMany(
      {
        $or: [
          { isListed: { $exists: false } },
          { isListed: null }
        ],
        status: { $ne: "sold" }
      },
      {
        $set: {
          isListed: true,
          status: "available"
        }
      }
    );

    console.log(`✅ Migration complete! Updated ${result.modifiedCount} products to be listed in marketplace.`);
    console.log(`   - Matched: ${result.matchedCount} products`);
    console.log(`   - Modified: ${result.modifiedCount} products`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

migrateProducts();

