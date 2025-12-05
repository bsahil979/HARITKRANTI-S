import mongoose from "mongoose";
import Product from "../src/models/Product.js";
import Listing from "../src/models/Listing.js";
import User from "../src/models/User.js";
import dotenv from "dotenv";
import { getMongoUri } from "../src/utils/mongoUri.js";

dotenv.config();

let MONGODB_URI;
try {
  MONGODB_URI = getMongoUri();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const migrateListingsToProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const listings = await Listing.find().populate("farmer");
    console.log(`📋 Found ${listings.length} listings to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const listing of listings) {
      // Check if product already exists
      const existing = await Product.findOne({
        name: listing.title,
        farmerId: listing.farmer?._id || listing.farmer,
      });

      if (existing) {
        console.log(`ℹ️  Product already exists: ${listing.title}`);
        skipped++;
        continue;
      }

      // Create product from listing
      await Product.create({
        name: listing.title,
        title: listing.title,
        description: listing.description || "",
        price: listing.pricePerKg,
        pricePerKg: listing.pricePerKg,
        quantity: listing.quantityKg,
        quantityKg: listing.quantityKg,
        quantityAvailable: listing.quantityKg,
        unit: "kg",
        category: listing.category || "other",
        imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : "",
        images: listing.images || [],
        farmerId: listing.farmer?._id || listing.farmer,
        farmer: listing.farmer?._id || listing.farmer,
        location: listing.location || {},
        status: listing.status || "available",
      });

      console.log(`✅ Migrated: ${listing.title}`);
      migrated++;
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   - Migrated: ${migrated}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`\n⚠️  Note: Listings are still in the database.`);
    console.log(`   You can delete them after verifying the migration.`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migrateListingsToProducts();

