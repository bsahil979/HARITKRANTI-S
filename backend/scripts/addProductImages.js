import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Product from "../src/models/Product.js";
import { getMongoUri } from "../src/utils/mongoUri.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Product images from reliable sources
const productImages = {
  "turmeric powder": "https://images.unsplash.com/photo-1606914509765-7c13205f7ef4?w=800&h=600&fit=crop",
  "turmeric": "https://images.unsplash.com/photo-1606914509765-7c13205f7ef4?w=800&h=600&fit=crop",
  "fresh mangoes": "https://images.unsplash.com/photo-1605027990121-c736cb47e52e?w=800&h=600&fit=crop",
  "mangoes": "https://images.unsplash.com/photo-1605027990121-c736cb47e52e?w=800&h=600&fit=crop",
  "mango": "https://images.unsplash.com/photo-1605027990121-c736cb47e52e?w=800&h=600&fit=crop",
};

let MONGODB_URI;
try {
  MONGODB_URI = getMongoUri();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const addProductImages = async () => {
  try {
    await connectDB();

    // Find products matching turmeric powder
    const turmericProducts = await Product.find({
      $or: [
        { name: { $regex: /turmeric.*powder/i } },
        { title: { $regex: /turmeric.*powder/i } },
        { name: { $regex: /^turmeric$/i } },
        { title: { $regex: /^turmeric$/i } },
      ],
    });

    console.log(`Found ${turmericProducts.length} turmeric powder product(s)`);

    for (const product of turmericProducts) {
      const imageUrl = productImages["turmeric powder"];
      const updated = await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            imageUrl: imageUrl,
            images: [imageUrl],
          },
        },
        { new: true }
      );
      console.log(`✓ Updated: ${updated.name} (${updated._id})`);
    }

    // Find products matching fresh mangoes
    const mangoProducts = await Product.find({
      $or: [
        { name: { $regex: /fresh.*mango/i } },
        { title: { $regex: /fresh.*mango/i } },
        { name: { $regex: /^mango/i } },
        { title: { $regex: /^mango/i } },
      ],
    });

    console.log(`\nFound ${mangoProducts.length} fresh mangoes product(s)`);

    for (const product of mangoProducts) {
      const imageUrl = productImages["fresh mangoes"];
      const updated = await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            imageUrl: imageUrl,
            images: [imageUrl],
          },
        },
        { new: true }
      );
      console.log(`✓ Updated: ${updated.name} (${updated._id})`);
    }

    console.log("\n✅ Product images added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding product images:", error);
    process.exit(1);
  }
};

addProductImages();

