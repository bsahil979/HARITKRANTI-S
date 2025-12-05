"use client";

import { useState, useEffect } from "react";
import { FaLeaf, FaCloudSun, FaFlask, FaRuler, FaMapMarkerAlt, FaThermometerHalf, FaTint, FaWind, FaSeedling, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaHistory } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const CropRecommendationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [formData, setFormData] = useState({
    soilType: "",
    soilPh: "",
    landArea: "",
    season: "",
    npk: {
      nitrogen: "",
      phosphorus: "",
      potassium: "",
    },
    location: {
      latitude: null,
      longitude: null,
      place: "",
    },
  });

  const [weatherData, setWeatherData] = useState({
    temperature: null,
    rainfall: null,
    humidity: null,
    windSpeed: null,
    soilMoisture: null,
  });

  const [recommendations, setRecommendations] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              place: "Your Location",
            },
          }));
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Use default location (New Delhi)
          setFormData((prev) => ({
            ...prev,
            location: {
              latitude: 28.6139,
              longitude: 77.209,
              place: "New Delhi, IN",
            },
          }));
          fetchWeatherData(28.6139, 77.209);
        }
      );
    } else {
      // Default to New Delhi
      fetchWeatherData(28.6139, 77.209);
    }
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    setIsLoadingWeather(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_moisture_0_to_7cm&timezone=auto&start_date=${today}&end_date=${today}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch weather");
      
      const data = await res.json();
      
      // Get today's data
      const todayIndex = 0;
      const avgTemp = (data.daily.temperature_2m_max[todayIndex] + data.daily.temperature_2m_min[todayIndex]) / 2;
      const rainfall = data.daily.precipitation_sum[todayIndex] || 0;
      
      // Average hourly data for today
      const hourlySlice = data.hourly?.temperature_2m?.slice(0, 24) || [];
      const avgHumidity = data.hourly?.relative_humidity_2m?.slice(0, 24).reduce((a, b) => a + b, 0) / 24 || 0;
      const avgWind = data.hourly?.wind_speed_10m?.slice(0, 24).reduce((a, b) => a + b, 0) / 24 || 0;
      const avgSoilMoisture = data.hourly?.soil_moisture_0_to_7cm?.slice(0, 24).reduce((a, b) => a + b, 0) / 24 || 0;

      setWeatherData({
        temperature: Math.round(avgTemp),
        rainfall: Math.round(rainfall * 10) / 10,
        humidity: Math.round(avgHumidity),
        windSpeed: Math.round(avgWind * 10) / 10,
        soilMoisture: Math.round(avgSoilMoisture * 10) / 10,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast.error("Could not fetch weather data. Recommendations will use basic parameters.");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("npk.")) {
      const npkField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        npk: {
          ...prev.npk,
          [npkField]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleLocationSearch = async (e) => {
    e.preventDefault();
    const query = e.target.location.value;
    if (!query.trim()) return;

    try {
      setIsLoadingWeather(true);
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
      const res = await fetch(geoUrl);
      if (!res.ok) throw new Error("Failed to geocode location");
      
      const data = await res.json();
      const top = data.results?.[0];
      if (!top) throw new Error("Location not found");

      setFormData((prev) => ({
        ...prev,
        location: {
          latitude: top.latitude,
          longitude: top.longitude,
          place: `${top.name}${top.country ? ", " + top.country : ""}`,
        },
      }));

      await fetchWeatherData(top.latitude, top.longitude);
      toast.success("Location updated!");
    } catch (error) {
      toast.error(error.message || "Location search failed");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.soilType || !formData.landArea) {
      toast.error("Please fill in required fields (Soil Type and Land Area)");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        soilType: formData.soilType,
        soilPh: formData.soilPh || undefined,
        landArea: formData.landArea,
        season: formData.season || undefined,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        place: formData.location.place,
        npk: formData.npk.nitrogen || formData.npk.phosphorus || formData.npk.potassium
          ? {
              nitrogen: formData.npk.nitrogen || 0,
              phosphorus: formData.npk.phosphorus || 0,
              potassium: formData.npk.potassium || 0,
            }
          : undefined,
        temperature: weatherData.temperature,
        rainfall: weatherData.rainfall,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        soilMoisture: weatherData.soilMoisture,
      };

      const config = user?.token
        ? {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        : {};

      const requestUrl = `${API_URL}/crop-recommendation/recommend`;
      console.log("Making request to:", requestUrl);
      console.log("API_URL:", API_URL);
      console.log("Payload:", payload);

      const { data } = await axios.post(
        requestUrl,
        payload,
        config
      );

      setRecommendations(data.data);
      toast.success("Recommendations generated successfully!");
    } catch (error) {
      console.error("Recommendation error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      
      let errorMessage = "Failed to get recommendations. Please try again.";
      if (error.response?.status === 404) {
        errorMessage = "Route not found. Please make sure the backend server is running and has the crop recommendation route.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceBadge = (confidence) => {
    const colors = {
      high: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      low: "bg-orange-100 text-orange-800 border-orange-300",
    };
    return colors[confidence] || colors.medium;
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Crop Recommendation</h1>
            <p className="text-lg text-gray-600">
              Get AI-powered crop recommendations based on your soil, weather, and location data.
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            {user && (
              <Link
                to="/crop-recommendation/history"
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                title="View Recommendation History"
              >
                <FaHistory />
                <span className="hidden sm:inline">History</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Weather Data Display */}
      {weatherData.temperature && (
        <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCloudSun className="text-blue-500" />
            Current Weather Conditions
            {isLoadingWeather && <span className="text-sm text-gray-500">(Loading...)</span>}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <FaThermometerHalf className="text-red-500 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Temperature</div>
              <div className="text-lg font-semibold">{weatherData.temperature}°C</div>
            </div>
            <div className="text-center">
              <FaTint className="text-blue-500 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Rainfall</div>
              <div className="text-lg font-semibold">{weatherData.rainfall} mm</div>
            </div>
            <div className="text-center">
              <FaTint className="text-cyan-500 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="text-lg font-semibold">{weatherData.humidity}%</div>
            </div>
            <div className="text-center">
              <FaWind className="text-gray-500 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Wind Speed</div>
              <div className="text-lg font-semibold">{weatherData.windSpeed} m/s</div>
            </div>
            <div className="text-center">
              <FaFlask className="text-amber-500 text-2xl mx-auto mb-2" />
              <div className="text-sm text-gray-600">Soil Moisture</div>
              <div className="text-lg font-semibold">{weatherData.soilMoisture}</div>
            </div>
          </div>
          <form onSubmit={handleLocationSearch} className="mt-4 flex gap-2">
            <input
              name="location"
              type="text"
              placeholder="Search for a different location..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Update Location
            </button>
          </form>
          {formData.location.place && (
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-1">
              <FaMapMarkerAlt /> {formData.location.place}
            </div>
          )}
        </div>
      )}

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="glass p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFlask className="inline mr-2" />
                Soil Type <span className="text-red-500">*</span>
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Soil Type</option>
                <option value="loamy">Loamy</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
                <option value="chalky">Chalky</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaRuler className="inline mr-2" />
                Land Area (acres) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter land area"
                min="0.1"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSeedling className="inline mr-2" />
                Season
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Season (Optional)</option>
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="zaid">Zaid (Summer)</option>
                <option value="year-round">Year Round</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-sm text-green-600 hover:text-green-700 font-medium"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil pH (0-14)
                  </label>
                  <input
                    type="number"
                    name="soilPh"
                    value={formData.soilPh}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 6.5"
                    min="0"
                    max="14"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NPK Values (kg/hectare)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="number"
                        name="npk.nitrogen"
                        value={formData.npk.nitrogen}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="N"
                        min="0"
                      />
                      <div className="text-xs text-gray-500 mt-1">Nitrogen</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="npk.phosphorus"
                        value={formData.npk.phosphorus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="P"
                        min="0"
                      />
                      <div className="text-xs text-gray-500 mt-1">Phosphorus</div>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="npk.potassium"
                        value={formData.npk.potassium}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="K"
                        min="0"
                      />
                      <div className="text-xs text-gray-500 mt-1">Potassium</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? "Getting Recommendations..." : "Get Recommendations"}
            </button>
          </form>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          {recommendations?.recommendations?.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Recommended Crops</h2>
              {recommendations.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="glass p-6 rounded-2xl border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {rec.crop}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceBadge(
                            rec.confidence
                          )}`}
                        >
                          {rec.confidence.toUpperCase()} Confidence
                        </span>
                        <span className={`text-lg font-bold ${getScoreColor(rec.score)}`}>
                          {rec.score}% Match
                        </span>
                      </div>
                    </div>
                    {idx === 0 && (
                      <FaCheckCircle className="text-green-500 text-2xl" title="Top Recommendation" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <FaInfoCircle className="text-blue-500" />
                        Why this crop?
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {rec.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">Yield Estimate:</span>
                        <div className="text-gray-600">{rec.yieldEstimate}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Water Requirement:</span>
                        <div className="text-gray-600">{rec.waterRequirement}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Growing Period:</span>
                        <div className="text-gray-600">{rec.growingPeriod}</div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Market Price:</span>
                        <div className="text-gray-600">{rec.marketPrice}</div>
                      </div>
                    </div>

                    {rec.pestWarnings?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-1 flex items-center gap-2">
                          <FaExclamationTriangle className="text-orange-500" />
                          Pest Warnings:
                        </h4>
                        <div className="text-sm text-gray-600">
                          {rec.pestWarnings.join(", ")}
                        </div>
                      </div>
                    )}

                    {rec.diseaseWarnings?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
                          <FaExclamationTriangle className="text-red-500" />
                          Disease Warnings:
                        </h4>
                        <div className="text-sm text-gray-600">
                          {rec.diseaseWarnings.join(", ")}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="font-semibold text-gray-700">Fertilizer Needs:</span>
                      <div className="text-sm text-gray-600">{rec.fertilizerNeeds}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : recommendations ? (
            <div className="glass p-6 rounded-2xl text-center text-gray-500">
              No suitable crops found. Please adjust your parameters.
            </div>
          ) : (
            <div className="glass p-6 rounded-2xl text-center text-gray-500">
              Fill in the form and click "Get Recommendations" to see crop suggestions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendationPage;
