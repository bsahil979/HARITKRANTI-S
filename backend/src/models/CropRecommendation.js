import mongoose from "mongoose";

const cropRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      place: { type: String, required: false },
    },
    // Input parameters
    soilType: {
      type: String,
      enum: ["loamy", "clay", "sandy", "silty", "peaty", "chalky"],
      required: true,
    },
    soilPh: {
      type: Number,
      min: 0,
      max: 14,
      required: false,
    },
    npk: {
      nitrogen: { type: Number, min: 0, max: 100, required: false },
      phosphorus: { type: Number, min: 0, max: 100, required: false },
      potassium: { type: Number, min: 0, max: 100, required: false },
    },
    landArea: {
      type: Number,
      required: true,
      min: 0.1,
    },
    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid", "year-round"],
      required: false,
    },
    // Weather data (from API)
    weatherData: {
      temperature: { type: Number, required: false },
      rainfall: { type: Number, required: false },
      humidity: { type: Number, required: false },
      windSpeed: { type: Number, required: false },
      soilMoisture: { type: Number, required: false },
    },
    // Recommendations
    recommendations: [
      {
        crop: { type: String, required: true },
        score: { type: Number, min: 0, max: 100, required: true },
        confidence: { type: String, enum: ["high", "medium", "low"], required: true },
        reasons: [String],
        yieldEstimate: { type: String, required: false },
        waterRequirement: { type: String, required: false },
        marketPrice: { type: String, required: false },
        growingPeriod: { type: String, required: false },
        pestWarnings: [String],
        diseaseWarnings: [String],
        fertilizerNeeds: { type: String, required: false },
      },
    ],
    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CropRecommendation", cropRecommendationSchema);

