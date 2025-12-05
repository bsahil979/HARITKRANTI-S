import CropRecommendation from "../models/CropRecommendation.js";

// Crop database with detailed information
const CROP_DATABASE = {
  wheat: {
    name: "Wheat",
    soilTypes: ["loamy", "clay"],
    soilPhRange: [6.0, 7.5],
    temperatureRange: [15, 25],
    rainfallRange: [30, 100],
    npkPreference: { nitrogen: "high", phosphorus: "medium", potassium: "medium" },
    seasons: ["rabi"],
    waterRequirement: "Moderate (400-500mm)",
    growingPeriod: "120-150 days",
    yieldEstimate: "3-5 tons/hectare",
    pestWarnings: ["Aphids", "Rust", "Termites"],
    diseaseWarnings: ["Rust", "Smut", "Powdery Mildew"],
    fertilizerNeeds: "NPK 120:60:40 kg/hectare",
    marketPrice: "₹2,000-2,500/quintal",
  },
  rice: {
    name: "Rice",
    soilTypes: ["clay", "loamy"],
    soilPhRange: [5.5, 7.0],
    temperatureRange: [20, 35],
    rainfallRange: [100, 200],
    npkPreference: { nitrogen: "high", phosphorus: "high", potassium: "medium" },
    seasons: ["kharif"],
    waterRequirement: "High (1000-1500mm)",
    growingPeriod: "120-150 days",
    yieldEstimate: "4-6 tons/hectare",
    pestWarnings: ["Stem Borer", "Brown Planthopper", "Leaf Folder"],
    diseaseWarnings: ["Blast", "Sheath Blight", "Bacterial Leaf Blight"],
    fertilizerNeeds: "NPK 120:60:40 kg/hectare",
    marketPrice: "₹1,800-2,200/quintal",
  },
  maize: {
    name: "Maize",
    soilTypes: ["loamy", "sandy"],
    soilPhRange: [5.8, 7.0],
    temperatureRange: [18, 27],
    rainfallRange: [50, 100],
    npkPreference: { nitrogen: "high", phosphorus: "medium", potassium: "medium" },
    seasons: ["kharif", "rabi"],
    waterRequirement: "Moderate (500-800mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "5-8 tons/hectare",
    pestWarnings: ["Fall Armyworm", "Stem Borer", "Aphids"],
    diseaseWarnings: ["Turcicum Leaf Blight", "Rust", "Ear Rot"],
    fertilizerNeeds: "NPK 150:60:60 kg/hectare",
    marketPrice: "₹1,500-2,000/quintal",
  },
  tomato: {
    name: "Tomato",
    soilTypes: ["loamy", "sandy"],
    soilPhRange: [6.0, 7.0],
    temperatureRange: [20, 30],
    rainfallRange: [40, 80],
    npkPreference: { nitrogen: "medium", phosphorus: "high", potassium: "high" },
    seasons: ["year-round"],
    waterRequirement: "Moderate (600-800mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "25-40 tons/hectare",
    pestWarnings: ["Fruit Borer", "Whitefly", "Aphids"],
    diseaseWarnings: ["Early Blight", "Late Blight", "Bacterial Wilt"],
    fertilizerNeeds: "NPK 100:80:100 kg/hectare",
    marketPrice: "₹20-40/kg",
  },
  potato: {
    name: "Potato",
    soilTypes: ["loamy", "sandy"],
    soilPhRange: [4.8, 5.5],
    temperatureRange: [15, 25],
    rainfallRange: [30, 60],
    npkPreference: { nitrogen: "medium", phosphorus: "high", potassium: "high" },
    seasons: ["rabi", "zaid"],
    waterRequirement: "Moderate (500-700mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "20-30 tons/hectare",
    pestWarnings: ["Colorado Beetle", "Aphids", "Cutworms"],
    diseaseWarnings: ["Late Blight", "Early Blight", "Blackleg"],
    fertilizerNeeds: "NPK 120:80:120 kg/hectare",
    marketPrice: "₹15-25/kg",
  },
  sugarcane: {
    name: "Sugarcane",
    soilTypes: ["loamy", "clay"],
    soilPhRange: [6.0, 7.5],
    temperatureRange: [26, 32],
    rainfallRange: [100, 150],
    npkPreference: { nitrogen: "high", phosphorus: "medium", potassium: "high" },
    seasons: ["year-round"],
    waterRequirement: "High (1500-2000mm)",
    growingPeriod: "300-365 days",
    yieldEstimate: "70-100 tons/hectare",
    pestWarnings: ["Top Borer", "Stem Borer", "White Grub"],
    diseaseWarnings: ["Red Rot", "Smut", "Rust"],
    fertilizerNeeds: "NPK 200:80:120 kg/hectare",
    marketPrice: "₹3,000-3,500/ton",
  },
  cotton: {
    name: "Cotton",
    soilTypes: ["loamy", "clay"],
    soilPhRange: [5.5, 8.0],
    temperatureRange: [21, 30],
    rainfallRange: [50, 100],
    npkPreference: { nitrogen: "medium", phosphorus: "medium", potassium: "medium" },
    seasons: ["kharif"],
    waterRequirement: "Moderate (600-800mm)",
    growingPeriod: "150-180 days",
    yieldEstimate: "2-3 tons/hectare (lint)",
    pestWarnings: ["Bollworm", "Aphids", "Whitefly"],
    diseaseWarnings: ["Fusarium Wilt", "Verticillium Wilt", "Leaf Curl"],
    fertilizerNeeds: "NPK 100:50:50 kg/hectare",
    marketPrice: "₹6,000-7,000/quintal",
  },
  soybean: {
    name: "Soybean",
    soilTypes: ["loamy", "clay"],
    soilPhRange: [6.0, 7.0],
    temperatureRange: [20, 30],
    rainfallRange: [50, 100],
    npkPreference: { nitrogen: "low", phosphorus: "high", potassium: "medium" },
    seasons: ["kharif"],
    waterRequirement: "Moderate (450-700mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "2-3 tons/hectare",
    pestWarnings: ["Stem Fly", "Pod Borer", "Aphids"],
    diseaseWarnings: ["Rust", "Bacterial Blight", "Charcoal Rot"],
    fertilizerNeeds: "NPK 20:60:40 kg/hectare (N-fixing)",
    marketPrice: "₹3,500-4,500/quintal",
  },
  groundnut: {
    name: "Groundnut",
    soilTypes: ["sandy", "loamy"],
    soilPhRange: [6.0, 7.0],
    temperatureRange: [25, 35],
    rainfallRange: [50, 75],
    npkPreference: { nitrogen: "low", phosphorus: "high", potassium: "medium" },
    seasons: ["kharif", "rabi"],
    waterRequirement: "Low-Moderate (500-600mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "2-3 tons/hectare",
    pestWarnings: ["Leaf Miner", "Aphids", "Termites"],
    diseaseWarnings: ["Rust", "Leaf Spot", "Stem Rot"],
    fertilizerNeeds: "NPK 20:60:40 kg/hectare (N-fixing)",
    marketPrice: "₹5,000-6,000/quintal",
  },
  mustard: {
    name: "Mustard",
    soilTypes: ["loamy", "clay"],
    soilPhRange: [6.0, 7.5],
    temperatureRange: [10, 25],
    rainfallRange: [30, 50],
    npkPreference: { nitrogen: "medium", phosphorus: "high", potassium: "medium" },
    seasons: ["rabi"],
    waterRequirement: "Low (300-400mm)",
    growingPeriod: "90-120 days",
    yieldEstimate: "1.5-2.5 tons/hectare",
    pestWarnings: ["Aphids", "Mustard Sawfly", "Caterpillar"],
    diseaseWarnings: ["Alternaria Blight", "White Rust", "Downy Mildew"],
    fertilizerNeeds: "NPK 80:40:40 kg/hectare",
    marketPrice: "₹4,500-5,500/quintal",
  },
};

/**
 * Calculate crop recommendation score
 */
function calculateCropScore(crop, params) {
  let score = 0;
  const maxScore = 100;

  // Soil type match (30 points)
  if (crop.soilTypes.includes(params.soilType)) {
    score += 30;
  } else {
    score += 10; // Partial match
  }

  // pH match (20 points)
  if (params.soilPh) {
    const [minPh, maxPh] = crop.soilPhRange;
    if (params.soilPh >= minPh && params.soilPh <= maxPh) {
      score += 20;
    } else {
      const distance = Math.min(
        Math.abs(params.soilPh - minPh),
        Math.abs(params.soilPh - maxPh)
      );
      score += Math.max(0, 20 - distance * 2);
    }
  } else {
    score += 10; // Neutral if not provided
  }

  // Temperature match (15 points)
  if (params.weatherData?.temperature) {
    const [minTemp, maxTemp] = crop.temperatureRange;
    if (
      params.weatherData.temperature >= minTemp &&
      params.weatherData.temperature <= maxTemp
    ) {
      score += 15;
    } else {
      const distance = Math.min(
        Math.abs(params.weatherData.temperature - minTemp),
        Math.abs(params.weatherData.temperature - maxTemp)
      );
      score += Math.max(0, 15 - distance);
    }
  } else {
    score += 7; // Neutral if not provided
  }

  // Rainfall match (15 points)
  if (params.weatherData?.rainfall) {
    const [minRain, maxRain] = crop.rainfallRange;
    if (
      params.weatherData.rainfall >= minRain &&
      params.weatherData.rainfall <= maxRain
    ) {
      score += 15;
    } else {
      const distance = Math.min(
        Math.abs(params.weatherData.rainfall - minRain),
        Math.abs(params.weatherData.rainfall - maxRain)
      );
      score += Math.max(0, 15 - distance / 10);
    }
  } else {
    score += 7; // Neutral if not provided
  }

  // Season match (10 points)
  if (params.season) {
    if (crop.seasons.includes(params.season) || crop.seasons.includes("year-round")) {
      score += 10;
    }
  } else {
    score += 5; // Neutral if not provided
  }

  // NPK match (10 points)
  if (params.npk) {
    let npkScore = 0;
    const npk = params.npk;
    const pref = crop.npkPreference;

    // Nitrogen
    if (pref.nitrogen === "high" && npk.nitrogen >= 60) npkScore += 3.33;
    else if (pref.nitrogen === "medium" && npk.nitrogen >= 30 && npk.nitrogen <= 70)
      npkScore += 3.33;
    else if (pref.nitrogen === "low" && npk.nitrogen <= 40) npkScore += 3.33;

    // Phosphorus
    if (pref.phosphorus === "high" && npk.phosphorus >= 50) npkScore += 3.33;
    else if (
      pref.phosphorus === "medium" &&
      npk.phosphorus >= 25 &&
      npk.phosphorus <= 60
    )
      npkScore += 3.33;
    else if (pref.phosphorus === "low" && npk.phosphorus <= 35) npkScore += 3.33;

    // Potassium
    if (pref.potassium === "high" && npk.potassium >= 50) npkScore += 3.33;
    else if (
      pref.potassium === "medium" &&
      npk.potassium >= 25 &&
      npk.potassium <= 60
    )
      npkScore += 3.33;
    else if (pref.potassium === "low" && npk.potassium <= 35) npkScore += 3.33;

    score += npkScore;
  } else {
    score += 5; // Neutral if not provided
  }

  return Math.min(Math.round(score), maxScore);
}

/**
 * Get confidence level based on score
 */
function getConfidence(score) {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

/**
 * Generate reasons for recommendation
 */
function generateReasons(crop, params, score) {
  const reasons = [];

  if (crop.soilTypes.includes(params.soilType)) {
    reasons.push(`Well-suited for ${params.soilType} soil`);
  }

  if (params.soilPh) {
    const [minPh, maxPh] = crop.soilPhRange;
    if (params.soilPh >= minPh && params.soilPh <= maxPh) {
      reasons.push(`Optimal soil pH (${params.soilPh}) for this crop`);
    }
  }

  if (params.weatherData?.temperature) {
    const [minTemp, maxTemp] = crop.temperatureRange;
    if (
      params.weatherData.temperature >= minTemp &&
      params.weatherData.temperature <= maxTemp
    ) {
      reasons.push(`Temperature conditions are ideal (${params.weatherData.temperature}°C)`);
    }
  }

  if (params.season && crop.seasons.includes(params.season)) {
    reasons.push(`Perfect for ${params.season} season`);
  }

  if (params.weatherData?.rainfall) {
    const [minRain, maxRain] = crop.rainfallRange;
    if (
      params.weatherData.rainfall >= minRain &&
      params.weatherData.rainfall <= maxRain
    ) {
      reasons.push(`Rainfall levels are suitable (${params.weatherData.rainfall}mm)`);
    }
  }

  if (reasons.length === 0) {
    reasons.push("Moderate suitability based on available parameters");
  }

  return reasons;
}

/**
 * Get crop recommendations
 */
export const getCropRecommendations = async (req, res, next) => {
  try {
    const {
      soilType,
      soilPh,
      landArea,
      season,
      latitude,
      longitude,
      place,
      npk,
      temperature,
      rainfall,
      humidity,
      windSpeed,
      soilMoisture,
    } = req.body;

    // Validate required fields
    if (!soilType || !landArea) {
      return res.status(400).json({
        success: false,
        message: "Soil type and land area are required",
      });
    }

    // Prepare parameters
    const params = {
      soilType,
      soilPh: soilPh ? parseFloat(soilPh) : null,
      landArea: parseFloat(landArea),
      season: season || null,
      npk: npk
        ? {
            nitrogen: parseFloat(npk.nitrogen) || 0,
            phosphorus: parseFloat(npk.phosphorus) || 0,
            potassium: parseFloat(npk.potassium) || 0,
          }
        : null,
      weatherData: {
        temperature: temperature ? parseFloat(temperature) : null,
        rainfall: rainfall ? parseFloat(rainfall) : null,
        humidity: humidity ? parseFloat(humidity) : null,
        windSpeed: windSpeed ? parseFloat(windSpeed) : null,
        soilMoisture: soilMoisture ? parseFloat(soilMoisture) : null,
      },
    };

    // Calculate scores for all crops
    const cropScores = Object.entries(CROP_DATABASE).map(([key, crop]) => {
      const score = calculateCropScore(crop, params);
      const confidence = getConfidence(score);
      const reasons = generateReasons(crop, params, score);

      return {
        crop: crop.name,
        score,
        confidence,
        reasons,
        yieldEstimate: crop.yieldEstimate,
        waterRequirement: crop.waterRequirement,
        marketPrice: crop.marketPrice,
        growingPeriod: crop.growingPeriod,
        pestWarnings: crop.pestWarnings,
        diseaseWarnings: crop.diseaseWarnings,
        fertilizerNeeds: crop.fertilizerNeeds,
      };
    });

    // Sort by score (descending) and take top 5
    const recommendations = cropScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .filter((rec) => rec.score > 30); // Only show crops with score > 30

    // Save recommendation to database if user is authenticated
    if (req.user) {
      await CropRecommendation.create({
        user: req.user._id,
        location: latitude && longitude ? { latitude, longitude, place } : null,
        soilType,
        soilPh: params.soilPh,
        npk: params.npk,
        landArea: params.landArea,
        season: params.season,
        weatherData: params.weatherData,
        recommendations,
      });
    }

    res.json({
      success: true,
      data: {
        recommendations,
        parameters: params,
        location: latitude && longitude ? { latitude, longitude, place } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recommendation history for a user
 */
export const getRecommendationHistory = async (req, res, next) => {
  try {
    const recommendations = await CropRecommendation.find({
      user: req.user._id,
    })
      .sort("-createdAt")
      .limit(10)
      .populate("user", "name email");

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

