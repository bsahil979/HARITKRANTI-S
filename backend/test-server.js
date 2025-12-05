import dotenv from "dotenv";
dotenv.config();
import { getMongoUri } from "./src/utils/mongoUri.js";

console.log("Testing server imports...");

try {
  console.log("1. Testing express...");
  const express = await import("express");
  console.log("✓ Express imported");
  
  console.log("2. Testing database connection...");
  const { connectDB } = await import("./src/db.js");
  console.log("✓ DB module imported");
  
  console.log("3. Testing routes...");
  const imageRouter = await import("./src/routes/image.routes.js");
  console.log("✓ Image routes imported");
  
  console.log("4. Testing models...");
  const Image = await import("./src/models/Image.js");
  console.log("✓ Image model imported");
  
  console.log("\n✅ All imports successful!");
  console.log("\nStarting server...");
  
  const app = express.default();
  app.use(express.default.json());
  
  app.get("/health", (req, res) => res.json({ ok: true }));
  
  const PORT = process.env.PORT || 5000;
  let URI;
  try {
    URI = getMongoUri();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
  
  connectDB(URI)
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Database connection error:", err.message);
      process.exit(1);
    });
    
} catch (error) {
  console.error("❌ Import error:", error.message);
  console.error(error.stack);
  process.exit(1);
}



