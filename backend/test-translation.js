// Simple test script for translation API
// Run with: node test-translation.js

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env
const envPath = resolve(__dirname, ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
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
}

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const API_URL = process.env.API_URL || "http://localhost:5000/api";

console.log("🧪 Testing Translation API\n");
console.log("API Key:", API_KEY ? "✅ Set" : "❌ Not set");
console.log("API URL:", API_URL);
console.log("\n");

if (!API_KEY) {
  console.error("❌ GOOGLE_TRANSLATE_API_KEY not found in .env file");
  console.log("Please add it to backend/.env:");
  console.log("GOOGLE_TRANSLATE_API_KEY=your_api_key_here");
  process.exit(1);
}

// Test direct Google Translate API
async function testGoogleTranslate() {
  console.log("1️⃣ Testing Google Translate API directly...");
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: "Hello",
          target: "hi",
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error:", error);
      return false;
    }

    const data = await response.json();
    console.log("✅ Success! Translation:", data.data.translations[0].translatedText);
    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return false;
  }
}

// Test backend translation endpoint
async function testBackendTranslation() {
  console.log("\n2️⃣ Testing Backend Translation Endpoint...");
  try {
    const response = await fetch(`${API_URL}/translation/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Hello World",
        targetLang: "hi",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error:", error);
      return false;
    }

    const data = await response.json();
    console.log("✅ Success! Translation:", data.translatedText);
    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("💡 Make sure the backend server is running on port 5000");
    return false;
  }
}

// Test object translation
async function testObjectTranslation() {
  console.log("\n3️⃣ Testing Object Translation...");
  try {
    const response = await fetch(`${API_URL}/translation/object`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translations: {
          home: "Home",
          products: "Products",
          about: "About",
        },
        targetLang: "hi",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Error:", error);
      return false;
    }

    const data = await response.json();
    console.log("✅ Success! Translations:");
    console.log(JSON.stringify(data.translations, null, 2));
    return true;
  } catch (error) {
    console.error("❌ Error:", error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const test1 = await testGoogleTranslate();
  const test2 = await testBackendTranslation();
  const test3 = await testObjectTranslation();

  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Results:");
  console.log("Google Translate API:", test1 ? "✅ Pass" : "❌ Fail");
  console.log("Backend Text Endpoint:", test2 ? "✅ Pass" : "❌ Fail");
  console.log("Backend Object Endpoint:", test3 ? "✅ Pass" : "❌ Fail");
  console.log("=".repeat(50));

  if (test1 && test2 && test3) {
    console.log("\n🎉 All tests passed! Translation API is working correctly.");
  } else {
    console.log("\n⚠️  Some tests failed. Please check the errors above.");
  }
}

runTests().catch(console.error);

