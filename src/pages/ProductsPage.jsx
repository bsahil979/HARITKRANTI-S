"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getProducts } from "../redux/slices/productSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { FaFilter, FaSearch, FaSeedling, FaAppleAlt, FaCarrot, FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";
import { 
  getCurrentLocation, 
  sortByDeliveryTime, 
  sortByFreshness, 
  filterByDistance 
} from "../utils/gisUtils";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useI18n();

  const { products, loading } = useSelector((state) => state.products);
  const { categories, loading: categoryLoading } = useSelector(
    (state) => state.categories
  );

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sort: "newest",
    showNearItems: false,
    maxDistance: 50,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get categories and sync URL param
  useEffect(() => {
    dispatch(getCategories());

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [dispatch, location.search]);

  // Debounced product fetching
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = {};

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      dispatch(getProducts(params));
    }, 1000); // delay of 1 second

    return () => clearTimeout(delayDebounce);
  }, [dispatch, filters.category, filters.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      // Store in localStorage for persistence
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (error) {
      setLocationError(error.message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      // Simple coordinate parsing (lat,lng format)
      const coords = value.split(',').map(coord => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setUserLocation({ lat: coords[0], lng: coords[1] });
        localStorage.setItem('userLocation', JSON.stringify({ lat: coords[0], lng: coords[1] }));
        setLocationError(null);
      } else {
        setLocationError('Please enter coordinates in format: lat, lng');
      }
    }
  };

  // Load saved location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setUserLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  // Apply filters and sorting
  let filteredProducts = [...products];

  // Apply category filter (for fallback products when API doesn't handle it)
  if (filters.category) {
    // Map category names to match our fallback data
    const categoryMap = {
      'vegetables': 'Vegetables',
      'fruits': 'Fruits', 
      'grains': 'Grains & Cereals',
      'pulses': 'Pulses & Legumes'
    };
    
    const categoryName = categoryMap[filters.category] || filters.category;
    filteredProducts = filteredProducts.filter(product => 
      product.category?.name === categoryName || 
      product.category === categoryName
    );
  }

  // Apply distance filter
  if (filters.showNearItems && userLocation) {
    filteredProducts = filterByDistance(filteredProducts, userLocation, filters.maxDistance);
  }

  // Apply sorting
  const sortedProducts = (() => {
    if (filters.sort === "newest") {
      return filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "price-low") {
      return filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-high") {
      return filteredProducts.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "fastest-delivery" && userLocation) {
      return sortByDeliveryTime(filteredProducts, userLocation);
    } else if (filters.sort === "freshness") {
      return sortByFreshness(filteredProducts);
    }
    return filteredProducts;
  })();

  const resultsCount = sortedProducts.length;

  if (loading || categoryLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Direct Marketplace</h1>
        <p className="text-lg text-gray-600">
          Connect directly with farmers and buy fresh fruits and vegetables at fair prices.
        </p>
      </div>

      {/* Location Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" />
          {t("locationRequired")}
        </h3>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter coordinates (lat, lng) or use current location"
              onChange={handleLocationInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {locationError && (
              <p className="text-red-500 text-sm mt-1">{locationError}</p>
            )}
          </div>
          
          <button
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaLocationArrow className={isGettingLocation ? "animate-spin" : ""} />
            {isGettingLocation ? "Getting..." : t("useCurrentLocation")}
          </button>
        </div>
        
        {userLocation && (
          <p className="text-green-600 text-sm mt-2">
            ✓ Location set: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">{resultsCount} {t("results")}</div>


      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-grow">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder={t("searchProductsPlaceholder")}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </form>

          <div className="flex gap-4">
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price-low">{t("priceLow")}</option>
              <option value="price-high">{t("priceHigh")}</option>
              {userLocation && (
                <>
                  <option value="fastest-delivery">{t("sortByFastestDelivery")}</option>
                  <option value="freshness">{t("sortByFreshness")}</option>
                </>
              )}
            </select>

            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaFilter />
              <span>{t("filters")}</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("category")}</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">{t("allCategories")}</option>
                  <option value="vegetables">🥬 Vegetables</option>
                  <option value="fruits">🍎 Fruits</option>
                  <option value="grains">🌾 Grains & Cereals</option>
                  <option value="pulses">🧅 Pulses & Legumes</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {userLocation && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        name="showNearItems"
                        checked={filters.showNearItems}
                        onChange={(e) => setFilters(prev => ({ ...prev, showNearItems: e.target.checked }))}
                        className="mr-2"
                      />
                      {t("showNearItems")}
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Distance ({t("km")})
                    </label>
                    <select
                      name="maxDistance"
                      value={filters.maxDistance}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={15}>15 {t("km")}</option>
                      <option value={30}>30 {t("km")}</option>
                      <option value={50}>50 {t("km")}</option>
                      <option value={100}>100 {t("km")}</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} userLocation={userLocation} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaSeedling className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("noProductsFound")}</h3>
          <p className="text-gray-600">{t("tryAdjustSearch")}</p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
