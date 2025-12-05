import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";
import { getMongoUri } from "../src/utils/mongoUri.js";

dotenv.config();

const defaultCategories = [
  { name: "Grains", description: "Rice, Wheat, and other grains", icon: "🌾" },
  { name: "Vegetables", description: "Fresh vegetables", icon: "🥬" },
  { name: "Fruits", description: "Fresh fruits", icon: "🍎" },
  { name: "Pulses", description: "Lentils, Beans, and other pulses", icon: "🫘" },
  { name: "Spices", description: "Turmeric, Pepper, and other spices", icon: "🌶️" },
  { name: "Oilseeds", description: "Mustard, Sunflower, and other oilseeds", icon: "🌻" },
  { name: "Other", description: "Miscellaneous products", icon: "📦" },
];

async function seedCategories() {
  try {
    const URI = getMongoUri();

    await mongoose.connect(URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing categories (optional - remove if you want to keep existing)
    // await Category.deleteMany({});
    // console.log("Cleared existing categories");

    // Insert default categories
    const inserted = [];
    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        const category = await Category.create(cat);
        inserted.push(category);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`⏭️  Category already exists: ${cat.name}`);
      }
    }

    console.log(`\n✅ Seeding complete! ${inserted.length} new categories created.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();

