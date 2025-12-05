import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory (absolute path)
const envPath = resolve(__dirname, "../.env");
if (existsSync(envPath)) {
  // Try manual parsing to handle UTF-16 encoded .env files
  try {
    // Try UTF-8 first, fallback to UTF-16 if needed
    let envContent;
    try {
      envContent = readFileSync(envPath, "utf-8");
      // Check if it looks like UTF-16 (has BOM or null bytes)
      if (envContent.charCodeAt(0) === 0xFFFE || envContent.charCodeAt(0) === 0xFEFF || envContent.includes('\x00')) {
        envContent = readFileSync(envPath, "utf-16le");
        // Remove BOM if present
        if (envContent.charCodeAt(0) === 0xFEFF) {
          envContent = envContent.substring(1);
        }
      }
    } catch (e) {
      // Try UTF-16 if UTF-8 fails
      envContent = readFileSync(envPath, "utf-16le");
      if (envContent.charCodeAt(0) === 0xFEFF) {
        envContent = envContent.substring(1);
      }
    }
    const lines = envContent.split(/\r?\n/);
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const equalIndex = trimmed.indexOf("=");
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          const value = trimmed.substring(equalIndex + 1).trim();
          if (key && value) {
            process.env[key] = value;
          }
        }
      }
    });
  } catch (error) {
    console.error("Error parsing .env:", error);
    // Fallback to dotenv
    dotenv.config({ path: envPath, override: true });
  }
} else {
  // Try default dotenv behavior
  dotenv.config();
}
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { getMongoUri } from "./utils/mongoUri.js";
import listingRouter from "./routes/listing.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import purchaseRouter from "./routes/purchase.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import orderRouter from "./routes/order.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import imageRouter from "./routes/image.routes.js";
import cropRecommendationRouter from "./routes/cropRecommendation.routes.js";
import categoryRouter from "./routes/category.routes.js";
import translationRouter from "./routes/translation.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();
// CORS configuration - allow frontend URL from environment or default to all origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : true; // Allow all origins in development
app.use(cors({ origin: allowedOrigins, credentials: true }));
// Increase body size limit to handle images and large payloads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/health", (req, res) => res.json({ ok: true }));

// Debug: Check if translation API key is loaded
if (process.env.GOOGLE_TRANSLATE_API_KEY) {
  console.log('✅ GOOGLE_TRANSLATE_API_KEY loaded successfully');
} else {
  console.warn('⚠️  GOOGLE_TRANSLATE_API_KEY not found in environment variables');
}

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api/products", productRouter);
app.use("/api/purchases", purchaseRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/images", imageRouter);
app.use("/api/crop-recommendation", cropRecommendationRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/translation", translationRouter);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
let URI;
try {
  URI = getMongoUri();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

console.log("Environment check:");
console.log("PORT:", PORT);
console.log("MONGODB_URI:", URI ? (URI.includes("@") ? "Set (credentials present)" : "Set") : "Not set");

// Start server even if MongoDB connection fails (for development)
// This allows the API to be available even if DB is not connected
// Listen on 0.0.0.0 to allow external connections (required for Render deployment)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log("⚠️  Attempting MongoDB connection...");
  
  connectDB(URI)
    .then(() => {
      console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("❌ Mongo connection error:", err.message);
      console.warn("⚠️  Server is running but database operations will fail.");
      console.warn("⚠️  Please check your MongoDB Atlas IP whitelist settings.");
    });
});

