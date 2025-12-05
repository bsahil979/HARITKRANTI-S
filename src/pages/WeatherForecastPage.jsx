"use client";

import { useEffect, useMemo, useState } from "react";
import { FaCloudSun, FaCloudRain, FaSun, FaCloud } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";

function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const iconForCode = (code) => {
  if (code === 0) return <FaSun className="text-yellow-500 text-4xl" />;
  if ([1, 2].includes(code)) return <FaCloudSun className="text-yellow-500 text-4xl" />;
  if ([3].includes(code)) return <FaCloud className="text-gray-500 text-4xl" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <FaCloudRain className="text-blue-500 text-4xl" />;
  return <FaCloud className="text-gray-500 text-4xl" />;
};

const WeatherForecastPage = () => {
  const [coords, setCoords] = useState({ lat: 28.6139, lon: 77.209 }); // Default: New Delhi
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [daily, setDaily] = useState([]);
  const [resolvedPlace, setResolvedPlace] = useState("New Delhi, IN");
  const [hourly, setHourly] = useState({ time: [], temperature: [], precipitation: [], humidity: [], wind: [], soil: [] });
  const [showHourly, setShowHourly] = useState(false);
  const { t, lang } = useI18n();

  // Restore cached last location
  useEffect(() => {
    try {
      const cached = localStorage.getItem("hk_last_location");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.lat && parsed?.lon) {
          setCoords({ lat: parsed.lat, lon: parsed.lon });
          setResolvedPlace(parsed.name || "Saved Location");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setResolvedPlace("Your Location");
        },
        () => {
          // ignore errors, use default
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const dateRange = useMemo(() => {
    const start = new Date();
    const end = new Date(Date.now() + 5 * 86400000);
    return { start: formatDateYYYYMMDD(start), end: formatDateYYYYMMDD(end) };
  }, []);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,soil_moisture_0_to_7cm&timezone=auto&start_date=${dateRange.start}&end_date=${dateRange.end}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        const mapped = (data.daily.time || []).map((dateStr, idx) => ({
          date: dateStr,
          min: data.daily.temperature_2m_min?.[idx] ?? null,
          max: data.daily.temperature_2m_max?.[idx] ?? null,
          rain: data.daily.precipitation_sum?.[idx] ?? 0,
          code: data.daily.weathercode?.[idx] ?? 3,
        }));
        setDaily(mapped);
        setHourly({
          time: data.hourly?.time || [],
          temperature: data.hourly?.temperature_2m || [],
          precipitation: data.hourly?.precipitation || [],
          humidity: data.hourly?.relative_humidity_2m || [],
          wind: data.hourly?.wind_speed_10m || [],
          soil: data.hourly?.soil_moisture_0_to_7cm || [],
        });
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchForecast();
  }, [coords, dateRange.start, dateRange.end]);

  const onSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setIsLoading(true);
      setError("");
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`; // no key
      const res = await fetch(geoUrl);
      if (!res.ok) throw new Error("Failed to geocode location");
      const data = await res.json();
      const top = data.results?.[0];
      if (!top) throw new Error("Location not found");
      setCoords({ lat: top.latitude, lon: top.longitude });
      const name = `${top.name}${top.country ? ", " + top.country : ""}`;
      setResolvedPlace(name);
      try {
        localStorage.setItem("hk_last_location", JSON.stringify({ lat: top.latitude, lon: top.longitude, name }));
      } catch {}
    } catch (err) {
      setError(err.message || "Location search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const readableDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ 
          filter: 'brightness(1.1) saturate(1.15)',
        }}
        autoPlay
        muted
        loop
        playsInline
        poster="/haritvideo.mp4"
      >
        <source src="/haritvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Translucent White Overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-4 py-24">
        <h1 
          className="text-4xl font-bold text-center mb-6 text-gray-900"
          style={{ textShadow: '2px 2px 8px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6)' }}
        >
          {t("weatherTitle")}
        </h1>
        <p 
          className="text-center text-gray-800 mb-10 font-medium"
          style={{ textShadow: '1px 1px 6px rgba(255, 255, 255, 0.9), 0 0 8px rgba(255, 255, 255, 0.5)' }}
        >
          {t("weatherSubtitle")}
        </p>

        <form onSubmit={onSearch} className="max-w-xl mx-auto mb-10 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/98 backdrop-blur-md"
            style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
            placeholder={t("searchPlaceholder")}
          />
          <button 
            type="submit" 
            className="btn btn-primary px-6"
            style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
          >
            {t("search")}
          </button>
        </form>

        <div className="text-center mb-8">
          <span 
            className="inline-block bg-white/98 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 backdrop-blur-md"
            style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
          >
            {t("location")}: {resolvedPlace}
          </span>
        </div>

        {error && (
          <div 
            className="max-w-2xl mx-auto mb-6 text-center text-red-600 bg-white/98 backdrop-blur-md px-4 py-2 rounded-lg"
            style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div 
            className="text-center py-10 bg-white/98 backdrop-blur-md rounded-lg max-w-md mx-auto"
            style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
          >
            {t("loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {daily.map((d, idx) => (
              <div 
                key={idx} 
                className="glass p-6 rounded-2xl text-center transition-all duration-300 bg-white/98 backdrop-blur-md border border-white/60"
                style={{ 
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2), 0 6px 15px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="mb-4">{iconForCode(d.code)}</div>
                <h3 
                  className="text-xl font-semibold mb-2 text-gray-800"
                  style={{ textShadow: '1px 1px 4px rgba(255, 255, 255, 0.8)' }}
                >
                  {idx === 0 ? t("today") : new Date(d.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { weekday: "long" })}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{readableDate(d.date)}</p>
                <p 
                  className="text-2xl font-bold text-gray-900 mb-2"
                  style={{ textShadow: '1px 1px 4px rgba(255, 255, 255, 0.8)' }}
                >
                  {Math.round(d.max)}° / {Math.round(d.min)}°C
                </p>
                <p className="text-gray-700 font-medium">Rain: {Math.round(d.rain)} mm</p>
              </div>
            ))}
          </div>
        )}

        {/* Simplified key metrics without charts */}
        {hourly.time.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto">
            <div 
              className="p-5 rounded-xl border border-gray-200 bg-white/98 backdrop-blur-md"
              style={{ 
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3 
                className="font-semibold mb-3 text-gray-800"
                style={{ textShadow: '1px 1px 4px rgba(255, 255, 255, 0.8)' }}
              >
                Key Metrics (next 24h averages)
              </h3>
              <MetricsSnapshot time={hourly.time} humidity={hourly.humidity} wind={hourly.wind} soil={hourly.soil} />
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 
            className="text-2xl font-bold mb-4 text-center text-gray-900"
            style={{ textShadow: '2px 2px 8px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.6)' }}
          >
            Farming Guidance
          </h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {daily.slice(0, 3).map((d, idx) => {
              const highHeat = d.max >= 34;
              const wet = d.rain >= 5;
              const guidance = [
                highHeat ? "Irrigate early morning or late evening to reduce evap losses." : "Maintain regular irrigation schedule.",
                wet ? "Plan harvesting/field work on lower-rain days; improve drainage." : "Suitable for most field operations.",
                wet ? "Monitor for fungal disease; consider preventive fungicide if advised locally." : "Low disease pressure expected; continue routine scouting.",
              ];
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-xl border border-gray-200 bg-white/98 backdrop-blur-md"
                  style={{ 
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div 
                    className="font-semibold mb-1 text-gray-800"
                    style={{ textShadow: '1px 1px 4px rgba(255, 255, 255, 0.8)' }}
                  >
                    {idx === 0 ? t("today") : new Date(d.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", { weekday: "long" })}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{readableDate(d.date)} • Max {Math.round(d.max)}°C • Rain {Math.round(d.rain)} mm</div>
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                    {guidance.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecastPage;

function MetricsSnapshot({ time, humidity, wind, soil }) {
  const slice = 24;
  const toAvg = (arr) => {
    const vals = (arr || []).slice(0, slice).map((v) => Number(v ?? 0));
    if (vals.length === 0) return 0;
    return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
  };
  const avgHumidity = toAvg(humidity);
  const avgWind = toAvg(wind);
  const avgSoil = toAvg(soil);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div 
        className="p-4 rounded-lg border border-gray-200 bg-white/95 backdrop-blur-md"
        style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="text-sm text-gray-600 font-medium">Humidity (avg 24h)</div>
        <div className="text-2xl font-semibold text-gray-900">{avgHumidity}%</div>
      </div>
      <div 
        className="p-4 rounded-lg border border-gray-200 bg-white/95 backdrop-blur-md"
        style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="text-sm text-gray-600 font-medium">Wind Speed (avg 24h)</div>
        <div className="text-2xl font-semibold text-gray-900">{avgWind} m/s</div>
      </div>
      <div 
        className="p-4 rounded-lg border border-gray-200 bg-white/95 backdrop-blur-md"
        style={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="text-sm text-gray-600 font-medium">Soil Moisture 0-7cm (avg 24h)</div>
        <div className="text-2xl font-semibold text-gray-900">{avgSoil}</div>
      </div>
    </div>
  );
}
