"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaMapMarkerAlt, FaThermometerHalf, FaTint, FaWind, FaFlask, FaSeedling, FaCalendarAlt, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const CropRecommendationHistoryPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/crop-recommendation/history`,
        config
      );

      setHistory(data.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error(
        error.response?.data?.message || "Failed to load recommendation history"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConfidenceBadge = (confidence) => {
    const colors = {
      high: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      low: "bg-orange-100 text-orange-800 border-orange-300",
    };
    return colors[confidence] || colors.medium;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <FaHistory className="text-gray-400 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Recommendation History</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view your crop recommendation history.
          </p>
          <Link
            to="/login"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FaHistory className="text-green-500" />
              Recommendation History
            </h1>
            <p className="text-gray-600">
              View your past crop recommendations and their results
            </p>
          </div>
          <Link
            to="/crop-recommendation"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Get New Recommendation
          </Link>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center py-16">
          <FaHistory className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No History Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't generated any crop recommendations yet. Get started by
            creating your first recommendation!
          </p>
          <Link
            to="/crop-recommendation"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Get Your First Recommendation
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, index) => (
            <div
              key={item._id || index}
              className="glass p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Recommendation #{history.length - index}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setSelectedItem(selectedItem === index ? null : index)
                  }
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {selectedItem === index ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Soil Type</div>
                  <div className="font-semibold capitalize">{item.soilType}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Land Area</div>
                  <div className="font-semibold">{item.landArea} acres</div>
                </div>
                {item.season && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Season</div>
                    <div className="font-semibold capitalize">{item.season}</div>
                  </div>
                )}
                {item.location?.place && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="font-semibold text-sm truncate">
                      {item.location.place}
                    </div>
                  </div>
                )}
              </div>

              {/* Top Recommendations Preview */}
              <div className="mb-4">
                <h4 className="font-semibold mb-3">Top Recommendations:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.recommendations?.slice(0, 3).map((rec, recIndex) => (
                    <div
                      key={recIndex}
                      className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-800">
                          {rec.crop}
                        </span>
                        <span
                          className={`text-sm font-medium ${getScoreColor(
                            rec.score
                          )}`}
                        >
                          ({rec.score}%)
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs border ${getConfidenceBadge(
                            rec.confidence
                          )}`}
                        >
                          {rec.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                  {item.recommendations?.length > 3 && (
                    <div className="px-3 py-2 text-gray-600 text-sm">
                      +{item.recommendations.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedItem === index && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                  {/* Input Parameters */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FaInfoCircle className="text-blue-500" />
                      Input Parameters
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {item.soilPh && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">
                            Soil pH
                          </div>
                          <div className="font-semibold">{item.soilPh}</div>
                        </div>
                      )}
                      {item.npk && (
                        <>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Nitrogen
                            </div>
                            <div className="font-semibold">
                              {item.npk.nitrogen} kg/ha
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Phosphorus
                            </div>
                            <div className="font-semibold">
                              {item.npk.phosphorus} kg/ha
                            </div>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Potassium
                            </div>
                            <div className="font-semibold">
                              {item.npk.potassium} kg/ha
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Weather Data */}
                  {item.weatherData && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FaThermometerHalf className="text-orange-500" />
                        Weather Conditions
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {item.weatherData.temperature && (
                          <div className="p-3 bg-orange-50 rounded-lg text-center">
                            <FaThermometerHalf className="text-red-500 text-xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Temp</div>
                            <div className="font-semibold">
                              {item.weatherData.temperature}°C
                            </div>
                          </div>
                        )}
                        {item.weatherData.rainfall !== null && (
                          <div className="p-3 bg-blue-50 rounded-lg text-center">
                            <FaTint className="text-blue-500 text-xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Rainfall</div>
                            <div className="font-semibold">
                              {item.weatherData.rainfall} mm
                            </div>
                          </div>
                        )}
                        {item.weatherData.humidity && (
                          <div className="p-3 bg-cyan-50 rounded-lg text-center">
                            <FaTint className="text-cyan-500 text-xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Humidity</div>
                            <div className="font-semibold">
                              {item.weatherData.humidity}%
                            </div>
                          </div>
                        )}
                        {item.weatherData.windSpeed && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <FaWind className="text-gray-500 text-xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Wind</div>
                            <div className="font-semibold">
                              {item.weatherData.windSpeed} m/s
                            </div>
                          </div>
                        )}
                        {item.weatherData.soilMoisture && (
                          <div className="p-3 bg-amber-50 rounded-lg text-center">
                            <FaFlask className="text-amber-500 text-xl mx-auto mb-2" />
                            <div className="text-sm text-gray-600">Soil Moisture</div>
                            <div className="font-semibold">
                              {item.weatherData.soilMoisture}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* All Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FaSeedling className="text-green-500" />
                      All Recommendations
                    </h4>
                    <div className="space-y-4">
                      {item.recommendations?.map((rec, recIndex) => (
                        <div
                          key={recIndex}
                          className="p-4 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h5 className="text-lg font-bold text-gray-800 mb-1">
                                {rec.crop}
                              </h5>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getConfidenceBadge(
                                    rec.confidence
                                  )}`}
                                >
                                  {rec.confidence.toUpperCase()} Confidence
                                </span>
                                <span
                                  className={`text-lg font-bold ${getScoreColor(
                                    rec.score
                                  )}`}
                                >
                                  {rec.score}% Match
                                </span>
                                {recIndex === 0 && (
                                  <FaCheckCircle
                                    className="text-green-500"
                                    title="Top Recommendation"
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {rec.reasons && rec.reasons.length > 0 && (
                              <div>
                                <h6 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                  <FaInfoCircle className="text-blue-500" />
                                  Why this crop?
                                </h6>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {rec.reasons.map((reason, i) => (
                                    <li key={i}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              {rec.yieldEstimate && (
                                <div>
                                  <span className="font-semibold text-gray-700">
                                    Yield:
                                  </span>
                                  <div className="text-gray-600">
                                    {rec.yieldEstimate}
                                  </div>
                                </div>
                              )}
                              {rec.waterRequirement && (
                                <div>
                                  <span className="font-semibold text-gray-700">
                                    Water:
                                  </span>
                                  <div className="text-gray-600">
                                    {rec.waterRequirement}
                                  </div>
                                </div>
                              )}
                              {rec.growingPeriod && (
                                <div>
                                  <span className="font-semibold text-gray-700">
                                    Period:
                                  </span>
                                  <div className="text-gray-600">
                                    {rec.growingPeriod}
                                  </div>
                                </div>
                              )}
                              {rec.marketPrice && (
                                <div>
                                  <span className="font-semibold text-gray-700">
                                    Price:
                                  </span>
                                  <div className="text-gray-600">
                                    {rec.marketPrice}
                                  </div>
                                </div>
                              )}
                            </div>

                            {rec.pestWarnings?.length > 0 && (
                              <div>
                                <h6 className="font-semibold text-orange-700 mb-1 flex items-center gap-2">
                                  <FaExclamationTriangle className="text-orange-500" />
                                  Pest Warnings:
                                </h6>
                                <div className="text-sm text-gray-600">
                                  {rec.pestWarnings.join(", ")}
                                </div>
                              </div>
                            )}

                            {rec.diseaseWarnings?.length > 0 && (
                              <div>
                                <h6 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
                                  <FaExclamationTriangle className="text-red-500" />
                                  Disease Warnings:
                                </h6>
                                <div className="text-sm text-gray-600">
                                  {rec.diseaseWarnings.join(", ")}
                                </div>
                              </div>
                            )}

                            {rec.fertilizerNeeds && (
                              <div>
                                <span className="font-semibold text-gray-700">
                                  Fertilizer Needs:
                                </span>
                                <div className="text-sm text-gray-600">
                                  {rec.fertilizerNeeds}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropRecommendationHistoryPage;

