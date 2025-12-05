import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getMongoUri } from "../src/utils/mongoUri.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, "../.env") });

import AdminProduct from "../src/models/AdminProduct.js";
import Inventory from "../src/models/Inventory.js";

const checkAndSyncInventory = async () => {
  try {
    const mongoUri = getMongoUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    // Get all admin products
    const adminProducts = await AdminProduct.find({ status: "available" })
      .populate("inventory");

    console.log(`\nFound ${adminProducts.length} admin products with status "available"\n`);

    for (const product of adminProducts) {
      const inventory = product.inventory;
      
      if (!inventory) {
        console.log(`❌ ${product.name} (${product._id}): No inventory linked!`);
        continue;
      }

      const inventoryQty = inventory.availableQuantity || 0;
      const productQty = product.quantity || 0;

      console.log(`📦 ${product.name}:`);
      console.log(`   AdminProduct.quantity: ${productQty}`);
      console.log(`   Inventory.availableQuantity: ${inventoryQty}`);
      console.log(`   Inventory.totalQuantity: ${inventory.totalQuantity}`);
      console.log(`   Inventory.soldQuantity: ${inventory.soldQuantity}`);
      console.log(`   Status: ${product.status}`);

      if (productQty !== inventoryQty) {
        console.log(`   ⚠️  MISMATCH! Syncing...`);
        product.quantity = inventoryQty;
        if (inventoryQty === 0) {
          product.status = "out_of_stock";
        }
        await product.save();
        console.log(`   ✅ Synced: AdminProduct.quantity = ${inventoryQty}`);
      }

      if (inventoryQty === 0) {
        console.log(`   ⚠️  WARNING: Inventory is empty! Product should not be in marketplace.`);
      }

      console.log("");
    }

    console.log("\n✅ Inventory sync check complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkAndSyncInventory();

