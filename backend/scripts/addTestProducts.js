import mongoose from "mongoose";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Listing from "../src/models/Listing.js";
import Purchase from "../src/models/Purchase.js";
import Inventory from "../src/models/Inventory.js";
import AdminProduct from "../src/models/AdminProduct.js";
import bcrypt from "bcryptjs";
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

// Test products data
const testProducts = [
  {
    name: "Organic Tomatoes",
    description: "Fresh organic tomatoes, pesticide-free, harvested daily",
    price: 45,
    quantity: 100,
    category: "vegetables",
    imageUrl: "https://images.unsplash.com/photo-1546097491-c36b1e4c4e8b?w=400",
  },
  {
    name: "Premium Basmati Rice",
    description: "High-quality basmati rice, long grain, aromatic",
    price: 120,
    quantity: 50,
    category: "grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
  },
  {
    name: "Fresh Carrots",
    description: "Sweet and crunchy carrots, rich in beta-carotene",
    price: 35,
    quantity: 80,
    category: "vegetables",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
  },
  {
    name: "Red Lentils (Masoor Dal)",
    description: "Premium quality red lentils, protein-rich",
    price: 95,
    quantity: 60,
    category: "pulses",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
  },
  {
    name: "Fresh Spinach",
    description: "Organic spinach leaves, iron-rich, freshly picked",
    price: 30,
    quantity: 70,
    category: "vegetables",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  },
];

// Test listings data
const testListings = [
  {
    title: "Premium Wheat",
    description: "High-quality wheat grains, suitable for making flour",
    category: "grains",
    pricePerKg: 25,
    quantityKg: 200,
    location: {
      district: "Pune",
      state: "Maharashtra",
      pincode: "411001",
    },
    images: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"],
  },
  {
    title: "Fresh Mangoes",
    description: "Sweet and juicy mangoes, Alphonso variety",
    category: "fruits",
    pricePerKg: 80,
    quantityKg: 150,
    location: {
      district: "Ratnagiri",
      state: "Maharashtra",
      pincode: "415612",
    },
    images: ["https://images.unsplash.com/photo-1605027990121-c73661ea7c26?w=400"],
  },
  {
    title: "Turmeric Powder",
    description: "Pure turmeric powder, organic and chemical-free",
    category: "spices",
    pricePerKg: 150,
    quantityKg: 40,
    location: {
      district: "Erode",
      state: "Tamil Nadu",
      pincode: "638001",
    },
    images: ["https://images.unsplash.com/photo-1615485925505-63d4f86c2538?w=400"],
  },
];

const addTestProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get or create test farmers
    let farmer1 = await User.findOne({ email: "farmer1@test.com" });
    if (!farmer1) {
      const hashedPassword = await bcrypt.hash("farmer123", 12);
      farmer1 = await User.create({
        name: "Rajesh Kumar",
        email: "farmer1@test.com",
        password: hashedPassword,
        role: "farmer",
        phone: "+91 9876543210",
        address: {
          street: "Farm Road 1",
          city: "Pune",
          state: "Maharashtra",
          pincode: "411001",
        },
        farmDetails: {
          farmName: "Kumar Organic Farm",
          farmSize: "10 acres",
          crops: ["tomatoes", "carrots", "spinach"],
        },
        isActive: true,
      });
      console.log("✅ Created Farmer 1: Rajesh Kumar");
    } else {
      console.log("ℹ️  Farmer 1 already exists: Rajesh Kumar");
    }

    let farmer2 = await User.findOne({ email: "farmer2@test.com" });
    if (!farmer2) {
      const hashedPassword = await bcrypt.hash("farmer123", 12);
      farmer2 = await User.create({
        name: "Priya Sharma",
        email: "farmer2@test.com",
        password: hashedPassword,
        role: "farmer",
        phone: "+91 9876543211",
        address: {
          street: "Farm Road 2",
          city: "Ratnagiri",
          state: "Maharashtra",
          pincode: "415612",
        },
        farmDetails: {
          farmName: "Sharma Mango Orchard",
          farmSize: "15 acres",
          crops: ["mangoes", "wheat"],
        },
        isActive: true,
      });
      console.log("✅ Created Farmer 2: Priya Sharma");
    } else {
      console.log("ℹ️  Farmer 2 already exists: Priya Sharma");
    }

    let farmer3 = await User.findOne({ email: "farmer3@test.com" });
    if (!farmer3) {
      const hashedPassword = await bcrypt.hash("farmer123", 12);
      farmer3 = await User.create({
        name: "Suresh Reddy",
        email: "farmer3@test.com",
        password: hashedPassword,
        role: "farmer",
        phone: "+91 9876543212",
        address: {
          street: "Farm Road 3",
          city: "Erode",
          state: "Tamil Nadu",
          pincode: "638001",
        },
        farmDetails: {
          farmName: "Reddy Spice Farm",
          farmSize: "8 acres",
          crops: ["turmeric", "rice", "lentils"],
        },
        isActive: true,
      });
      console.log("✅ Created Farmer 3: Suresh Reddy");
    } else {
      console.log("ℹ️  Farmer 3 already exists: Suresh Reddy");
    }

    // Get admin user
    const admin = await User.findOne({ email: "admin@test.com", role: "admin" });
    if (!admin) {
      console.log("❌ Admin user not found! Please run createAdmin.js first.");
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log("✅ Found Admin:", admin.name);

    // Create products from farmers
    console.log("\n📦 Creating Products...");
    const createdProducts = [];
    
    for (let i = 0; i < testProducts.length; i++) {
      const productData = testProducts[i];
      const farmer = i < 2 ? farmer1 : i < 4 ? farmer2 : farmer3;
      
      // Check if product already exists
      const existing = await Product.findOne({
        name: productData.name,
        farmerId: farmer._id,
      });
      
      if (existing) {
        console.log(`ℹ️  Product already exists: ${productData.name}`);
        createdProducts.push(existing);
      } else {
        const product = await Product.create({
          ...productData,
          farmerId: farmer._id,
        });
        console.log(`✅ Created Product: ${product.name} (Farmer: ${farmer.name})`);
        createdProducts.push(product);
      }
    }

    // Create listings from farmers
    console.log("\n📋 Creating Listings...");
    const createdListings = [];
    
    for (let i = 0; i < testListings.length; i++) {
      const listingData = testListings[i];
      const farmer = i === 0 ? farmer2 : i === 1 ? farmer2 : farmer3;
      
      // Check if listing already exists
      const existing = await Listing.findOne({
        title: listingData.title,
        farmer: farmer._id,
      });
      
      if (existing) {
        console.log(`ℹ️  Listing already exists: ${listingData.title}`);
        createdListings.push(existing);
      } else {
        const listing = await Listing.create({
          ...listingData,
          farmer: farmer._id,
        });
        console.log(`✅ Created Listing: ${listing.title} (Farmer: ${farmer.name})`);
        createdListings.push(listing);
      }
    }

    // Create purchases from admin (purchasing products)
    console.log("\n🛒 Creating Purchases (Admin buying from farmers)...");
    const createdPurchases = [];
    
    for (let i = 0; i < Math.min(3, createdProducts.length); i++) {
      const product = createdProducts[i];
      const farmer = await User.findById(product.farmerId);
      
      // Check if purchase already exists
      const existingPurchase = await Purchase.findOne({
        product: product._id,
        admin: admin._id,
      });
      
      if (existingPurchase) {
        console.log(`ℹ️  Purchase already exists for: ${product.name}`);
        createdPurchases.push(existingPurchase);
      } else {
        const purchaseQuantity = Math.min(20, product.quantity);
        const purchasePrice = product.price * 0.9; // 10% discount for bulk purchase
        const totalAmount = purchaseQuantity * purchasePrice;
        
        const purchase = await Purchase.create({
          product: product._id,
          listing: null,
          farmer: farmer._id,
          admin: admin._id,
          quantity: purchaseQuantity,
          unit: "kg",
          purchasePrice: purchasePrice,
          totalAmount: totalAmount,
          status: "completed",
          notes: `Bulk purchase of ${product.name}`,
        });
        
        console.log(`✅ Created Purchase: ${product.name} (${purchaseQuantity} kg @ ₨${purchasePrice}/kg)`);
        createdPurchases.push(purchase);
        
        // Create inventory item
        const inventory = await Inventory.create({
          admin: admin._id,
          purchase: purchase._id,
          name: product.name,
          description: product.description,
          category: product.category,
          images: [product.imageUrl],
          totalQuantity: purchaseQuantity,
          availableQuantity: purchaseQuantity,
          soldQuantity: 0,
          unit: "kg",
          purchasePrice: purchasePrice,
          sellingPrice: product.price * 1.2, // 20% markup
          sourceFarmer: farmer._id,
          sourceProduct: product._id,
          status: "in_stock",
          warehouseLocation: "Main Warehouse - Section A",
        });
        
        console.log(`   📦 Added to Inventory: ${inventory.name} (${inventory.availableQuantity} ${inventory.unit} available)`);
      }
    }

    // Create purchases from listings
    console.log("\n🛒 Creating Purchases from Listings...");
    for (let i = 0; i < Math.min(2, createdListings.length); i++) {
      const listing = createdListings[i];
      const farmer = await User.findById(listing.farmer);
      
      // Check if purchase already exists
      const existingPurchase = await Purchase.findOne({
        listing: listing._id,
        admin: admin._id,
      });
      
      if (existingPurchase) {
        console.log(`ℹ️  Purchase already exists for: ${listing.title}`);
      } else {
        const purchaseQuantity = Math.min(50, listing.quantityKg);
        const purchasePrice = listing.pricePerKg * 0.85; // 15% discount for bulk
        const totalAmount = purchaseQuantity * purchasePrice;
        
        const purchase = await Purchase.create({
          product: null,
          listing: listing._id,
          farmer: farmer._id,
          admin: admin._id,
          quantity: purchaseQuantity,
          unit: "kg",
          purchasePrice: purchasePrice,
          totalAmount: totalAmount,
          status: "completed",
          notes: `Bulk purchase of ${listing.title}`,
        });
        
        console.log(`✅ Created Purchase: ${listing.title} (${purchaseQuantity} kg @ ₨${purchasePrice}/kg)`);
        
        // Create inventory item
        const inventory = await Inventory.create({
          admin: admin._id,
          purchase: purchase._id,
          name: listing.title,
          description: listing.description,
          category: listing.category,
          images: listing.images,
          totalQuantity: purchaseQuantity,
          availableQuantity: purchaseQuantity,
          soldQuantity: 0,
          unit: "kg",
          purchasePrice: purchasePrice,
          sellingPrice: listing.pricePerKg * 1.15, // 15% markup
          sourceFarmer: farmer._id,
          sourceProduct: listing._id,
          status: "in_stock",
          warehouseLocation: "Main Warehouse - Section B",
        });
        
        console.log(`   📦 Added to Inventory: ${inventory.name} (${inventory.availableQuantity} ${inventory.unit} available)`);
      }
    }

    // List some products in marketplace
    console.log("\n🏪 Listing Products in Marketplace...");
    const inventoryItems = await Inventory.find({ admin: admin._id, status: "in_stock" });
    
    for (let i = 0; i < Math.min(3, inventoryItems.length); i++) {
      const inventory = inventoryItems[i];
      
      // Check if already listed
      const existingAdminProduct = await AdminProduct.findOne({
        inventory: inventory._id,
        admin: admin._id,
      });
      
      if (existingAdminProduct) {
        console.log(`ℹ️  Product already listed: ${inventory.name}`);
      } else {
        const listQuantity = Math.min(inventory.availableQuantity, 30);
        
        const adminProduct = await AdminProduct.create({
          admin: admin._id,
          inventory: inventory._id,
          name: inventory.name,
          description: inventory.description,
          category: inventory.category,
          images: inventory.images,
          price: inventory.sellingPrice,
          pricePerKg: inventory.sellingPrice,
          quantity: listQuantity,
          unit: inventory.unit,
          status: "available",
          isAdminProduct: true,
          adminMarkup: inventory.sellingPrice - inventory.purchasePrice,
          location: {
            state: "Maharashtra",
            city: "Pune",
            district: "Pune",
          },
        });
        
        // Update inventory status
        inventory.status = "listed";
        await inventory.save();
        
        console.log(`✅ Listed in Marketplace: ${adminProduct.name} (${listQuantity} ${adminProduct.unit} @ ₨${adminProduct.price}/${adminProduct.unit})`);
        console.log(`   💰 Markup: ₨${adminProduct.adminMarkup.toFixed(2)} per ${adminProduct.unit}`);
      }
    }

    console.log("\n✅ Test data setup complete!");
    console.log("\n📊 Summary:");
    console.log(`   - Farmers: 3`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Listings: ${createdListings.length}`);
    console.log(`   - Purchases: ${await Purchase.countDocuments({ admin: admin._id })}`);
    console.log(`   - Inventory Items: ${await Inventory.countDocuments({ admin: admin._id })}`);
    console.log(`   - Marketplace Products: ${await AdminProduct.countDocuments({ admin: admin._id })}`);
    
    console.log("\n🔑 Test Farmer Credentials:");
    console.log("   Farmer 1: farmer1@test.com / farmer123");
    console.log("   Farmer 2: farmer2@test.com / farmer123");
    console.log("   Farmer 3: farmer3@test.com / farmer123");
    
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

addTestProducts();




