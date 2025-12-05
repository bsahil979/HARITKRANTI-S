"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { translateObject } from "../utils/translationService.js";

// Only English translations are kept - other languages are translated via API
const englishTranslations = {
  home: "Home",
  products: "Products",
  farmers: "Farmers",
  about: "About",
  login: "Login",
  register: "Register",
  messages: "Messages",
  adminDashboard: "Admin Dashboard",
  farmerDashboard: "Farmer Dashboard",
  profile: "Profile",
  orders: "Orders",
  logout: "Logout",
  weatherTitle: "Weather Forecast",
  weatherSubtitle: "Live 5-day forecast using your location or a place you search.",
  searchPlaceholder: "Search city, district, or village",
  search: "Search",
  location: "Location",
  loading: "Loading forecast…",
  farmingGuidance: "Farming Guidance",
  today: "Today",
  // Home
  announcement: "HaritKranti Announcement",
  heroTitleLine1: "Smart Agriculture",
  heroTitleLine2: "Farmer Marketplace",
  heroSubtitle1: "Advanced crop guidance, weather forecasting, and direct farmer-to-buyer marketplace.",
  heroSubtitle2: "Empowering farmers with technology and connecting communities.",
  shopNow: "Shop Now",
  meetFarmers: "Meet Our Farmers",
  whyChoose: "Why Choose HaritKranti?",
  cropRecommendation: "Crop Recommendation",
  cropRecommendationDesc: "Get scientific farming recommendations based on soil type, season, and weather conditions.",
  weatherForecasting: "Weather Forecasting",
  weatherForecastingDesc: "Access accurate 5-day weather forecasts to plan your farming activities effectively.",
  directMarketplace: "Direct Marketplace",
  directMarketplaceDesc: "Connect directly with buyers and sell your produce without intermediaries.",
  guidance: "Guidance",
  guidanceDesc: "Find valuable farming tips, techniques, and best practices for optimal crop growth.",
  featuredProducts: "Featured Products",
  viewAllProducts: "View All Products →",
  noFeatured: "No Featured Fruits and Vegetables Available",
  checkBack: "Check back soon for new products!",
  browseAll: "Browse All Products →",
  browseByCategory: "Browse By Category",
  categoriesComing: "Categories Coming Soon",
  categoriesWorking: "We're working on organizing our products into categories.",
  ourFarmers: "Our Farmers",
  viewAllFarmers: "View All Farmers →",
  meetSomeFarmers: "Meet some of our dedicated farmers from across India:",
  noFarmersYet: "No Farmers Available Yet",
  connectingFarmers: "We're working on connecting with local farmers.",
  checkBackLater: "Check Back Later →",
  ctaReady: "Ready to Get Started?",
  ctaText: "Join our community today and start enjoying fresh, local produce while supporting farmers in your area.",
  signUpNow: "Sign Up Now",
  learnMore: "Learn More",
  // Products
  browseProducts: "Browse Products",
  freshFruits: "Fresh Fruits",
  freshVegetables: "Fresh Vegetables",
  searchProductsPlaceholder: "Search products...",
  newest: "Newest",
  priceLow: "Price: Low to High",
  priceHigh: "Price: High to Low",
  filters: "Filters",
  category: "Category",
  allCategories: "All Categories",
  noProductsFound: "No Products Found",
  tryAdjustSearch: "Try adjusting your search or filter criteria.",
  // Farmers
  ourFarmersTitle: "Our Farmers",
  searchFarmersPlaceholder: "Search farmers...",
  noFarmersFound: "No Farmers Found",
  tryAdjustFarmers: "Try adjusting your search criteria.",
  // About
  ourStory: "Our Story",
  aboutHarit: "About HaritKranti",
  aboutSubtitle: "Smart Agriculture & Farmer Marketplace platform empowering farmers with technology, weather forecasting, crop guidance, and direct market access.",
  ourMission: "Our Mission",
  missionP1: "HaritKranti was founded with a revolutionary mission: to transform agriculture through technology and create sustainable farming communities. We provide crop guidance, weather forecasting, and direct marketplace access to empower farmers.",
  missionP2: "By combining smart agriculture practices with modern technology, we're building a comprehensive platform that supports farmers from crop planning to market sales, ensuring better yields and fair profits.",
  howItWorks: "How It Works",
  smartGuidance: "Smart Guidance",
  smartGuidanceDesc: "Get personalized crop recommendations based on soil analysis, weather patterns, and seasonal conditions. Access expert advice and scientific farming practices.",
  weatherAlerts: "Weather & Alerts",
  weatherAlertsDesc: "Receive real-time weather updates, pest alerts, and disease warnings. Plan your farming activities with accurate forecasting and seasonal predictions.",
  marketplace: "Marketplace",
  marketplaceDesc: "List your crops directly to buyers, manage orders efficiently, and get fair prices. Connect with consumers who value quality and sustainable farming.",
  benefits: "Benefits",
  forConsumers: "For Consumers",
  consB1: "Access to fresher, more nutritious produce",
  consB2: "Knowledge about where your food comes from and how it's grown",
  consB3: "Support for local economy and sustainable farming practices",
  consB4: "Reduced environmental impact from shorter supply chains",
  consB5: "Direct communication with farmers",
  forFarmers: "For Farmers",
  farmB1: "Higher profit margins by selling directly to consumers",
  farmB2: "Stable local market for products",
  farmB3: "Reduced waste through better demand planning",
  farmB4: "Opportunity to showcase sustainable farming practices",
  farmB5: "Direct feedback from customers",
  meetTeam: "Meet Our Team",
  passionateTeam: "Passionate people behind HaritKranti",
  joinCommunity: "Join Our Community",
  joinCommunityDesc: "Whether you're a farmer seeking smart agriculture solutions or a consumer looking for fresh produce, HaritKranti is your platform.",
  browseProductsCta: "Browse Products",
  addToCart: "Add to Cart",
  view: "View",
  farmerDirect: "Farmer-direct",
  fresh: "Fresh",
  traceable: "Traceable",
  results: "results",
  // GIS & Delivery
  nearYou: "Near You",
  farSeller: "Far Seller",
  freshTill: "Fresh till",
  expiresIn: "Expires in",
  longShelfLife: "Long shelf life — no urgency",
  pantryItem: "Pantry item — safe for months",
  freshAndFast: "Fresh & Deliverable Quickly",
  estimatedDelivery: "ETA",
  distance: "Distance",
  showNearItems: "Show Near Items",
  sortByFastestDelivery: "Sort by Fastest Delivery",
  sortByFreshness: "Sort by Freshness",
  enterLocation: "Enter Location",
  useCurrentLocation: "Use Current Location",
  locationRequired: "Location required for delivery estimates",
  days: "days",
  hours: "hours",
  minutes: "minutes",
  km: "km",
  miles: "miles",
  // Farmer Profiles & Verification
  verifiedFarmer: "Verified Farmer",
  viewProfile: "View Profile",
  farmingExperience: "Farming Experience",
  years: "years",
  region: "Region",
  cropsGrown: "Crops Grown",
  certifications: "Certifications",
  farmPhotos: "Farm Photos",
  bio: "Bio",
  farmingBackground: "Farming Background",
  qualityAssurance: "Quality Assurance",
  warehouseNote: "All produce from this farmer is collected and quality-checked at the HaritKranti warehouse before being delivered to customers.",
  organicCertified: "Organic Certified",
  gmpCertified: "GMP Certified",
  isoCertified: "ISO Certified",
  contactFarmer: "Contact Farmer",
  messageFarmer: "Message Farmer",
  establishedSince: "Established Since",
  farmSize: "Farm Size",
  acres: "acres",
  hectares: "hectares",
  farmingMethods: "Farming Methods",
  sustainable: "Sustainable",
  traditional: "Traditional",
  modern: "Modern",
  mixed: "Mixed",
  specialties: "Specialties",
  awards: "Awards",
  testimonials: "Customer Testimonials",
  rating: "Rating",
  reviews: "reviews",
  joinDate: "Joined HaritKranti",
  lastActive: "Last Active",
  responseTime: "Response Time",
  withinHours: "within hours",
  trustScore: "Trust Score",
  verified: "Verified",
  pending: "Pending",
  rejected: "Rejected",
  // Category Section
  freshProduceDirect: "Fresh Produce Direct from Partnered Farmers",
  vegetables: "Vegetables",
  fruits: "Fruits",
  grainsCereals: "Grains & Cereals",
  pulsesLegumes: "Pulses & Legumes",
  vegetablesTagline: "Leafy greens, tomatoes, onions",
  fruitsTagline: "Mangoes, bananas, papayas",
  grainsTagline: "Rice, wheat, jowar, bajra",
  pulsesTagline: "Moong, toor, chana, masoor",
  sourcedFromVerified: "Sourced from verified local farmers",
};

const I18nContext = createContext({ 
  lang: "en", 
  t: (k) => k, 
  setLang: () => {},
  isLoading: false 
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("hk_lang") || "en");
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState({});

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      // If English, use English translations directly
      if (lang === "en") {
        setTranslations(englishTranslations);
        return;
      }

      // Check if we already have translations cached in state
      if (translationCache[lang]) {
        setTranslations(translationCache[lang]);
        return;
      }

      // Load from API
      setIsLoading(true);
      try {
        const translated = await translateObject(englishTranslations, lang);
        setTranslations(translated);
        // Cache in state
        setTranslationCache(prev => ({
          ...prev,
          [lang]: translated
        }));
      } catch (error) {
        console.error("Error loading translations:", error);
        // Fallback to English on error
        setTranslations(englishTranslations);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [lang, translationCache]);

  // Translation function
  const t = useMemo(() => {
    const dict = lang === "en" ? englishTranslations : translations;
    return (key) => {
      // If translations are still loading and not English, show key or English fallback
      if (isLoading && lang !== "en" && !dict[key]) {
        return englishTranslations[key] || key;
      }
      return dict[key] ?? englishTranslations[key] ?? key;
    };
  }, [lang, translations, isLoading]);

  const setLangWithStorage = (newLang) => {
    localStorage.setItem("hk_lang", newLang);
    setLang(newLang);
  };

  const value = useMemo(
    () => ({ 
      lang, 
      setLang: setLangWithStorage, 
      t,
      isLoading 
    }), 
    [lang, t, isLoading]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
