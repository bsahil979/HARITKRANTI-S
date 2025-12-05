// GIS utility functions for delivery and freshness calculations

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Estimate delivery time based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {Object} Delivery time information
 */
export const estimateDeliveryTime = (distance) => {
  if (distance <= 5) {
    return {
      time: 30,
      unit: 'minutes',
      category: 'near'
    };
  } else if (distance <= 15) {
    return {
      time: 1,
      unit: 'hours',
      category: 'near'
    };
  } else if (distance <= 50) {
    return {
      time: 2,
      unit: 'hours',
      category: 'medium'
    };
  } else {
    return {
      time: Math.ceil(distance / 30),
      unit: 'hours',
      category: 'far'
    };
  }
};

/**
 * Get delivery badge information
 * @param {number} distance - Distance in kilometers
 * @returns {Object} Badge information
 */
export const getDeliveryBadge = (distance) => {
  if (distance <= 15) {
    return {
      text: 'Near You',
      emoji: '🟢',
      color: 'green'
    };
  } else {
    return {
      text: 'Far Seller',
      emoji: '🟡',
      color: 'yellow'
    };
  }
};

/**
 * Calculate freshness status for perishable items
 * @param {Date} harvestDate - Date when crop was harvested
 * @param {string} cropType - Type of crop (perishable, semi-perishable, non-perishable)
 * @returns {Object} Freshness information
 */
export const calculateFreshness = (harvestDate, cropType = 'perishable') => {
  const now = new Date();
  const harvest = new Date(harvestDate);
  const daysSinceHarvest = Math.floor((now - harvest) / (1000 * 60 * 60 * 24));

  // Define shelf life based on crop type
  const shelfLife = {
    'perishable': 3,      // 3 days (fruits, leafy vegetables)
    'semi-perishable': 7, // 7 days (root vegetables, some fruits)
    'non-perishable': 365 // 1 year (grains, pulses)
  };

  const maxShelfLife = shelfLife[cropType] || shelfLife.perishable;
  const daysRemaining = maxShelfLife - daysSinceHarvest;

  if (cropType === 'non-perishable') {
    return {
      status: 'long-shelf-life',
      message: 'Long shelf life — no urgency',
      emoji: '🟢',
      color: 'green',
      daysRemaining: null
    };
  }

  if (daysRemaining <= 0) {
    return {
      status: 'expired',
      message: 'Expired',
      emoji: '🔴',
      color: 'red',
      daysRemaining: 0
    };
  } else if (daysRemaining <= 1) {
    return {
      status: 'expiring-soon',
      message: 'Expires in 1 day',
      emoji: '🟠',
      color: 'orange',
      daysRemaining: 1
    };
  } else if (daysRemaining <= 2) {
    return {
      status: 'expiring-soon',
      message: `Expires in ${daysRemaining} days`,
      emoji: '🟠',
      color: 'orange',
      daysRemaining
    };
  } else {
    return {
      status: 'fresh',
      message: `Fresh till: ${new Date(harvest.getTime() + maxShelfLife * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      emoji: '🟢',
      color: 'green',
      daysRemaining
    };
  }
};

/**
 * Check if product qualifies for "Fresh & Fast" highlight
 * @param {Object} product - Product object with location and freshness data
 * @param {Object} userLocation - User's current location
 * @returns {boolean} Whether product qualifies for highlight
 */
export const isFreshAndFast = (product, userLocation) => {
  if (!userLocation || !product.farmer?.location) return false;
  
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    product.farmer.location.lat,
    product.farmer.location.lng
  );
  
  const freshness = calculateFreshness(product.harvestDate, product.cropType);
  
  return distance <= 15 && freshness.status === 'fresh';
};

/**
 * Get user's current location using browser geolocation
 * @returns {Promise<Object>} Location coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Sort products by delivery time
 * @param {Array} products - Array of products
 * @param {Object} userLocation - User's current location
 * @returns {Array} Sorted products
 */
export const sortByDeliveryTime = (products, userLocation) => {
  if (!userLocation) return products;

  return [...products].sort((a, b) => {
    const distanceA = a.farmer?.location ? 
      calculateDistance(userLocation.lat, userLocation.lng, a.farmer.location.lat, a.farmer.location.lng) : 
      Infinity;
    const distanceB = b.farmer?.location ? 
      calculateDistance(userLocation.lat, userLocation.lng, b.farmer.location.lat, b.farmer.location.lng) : 
      Infinity;
    
    return distanceA - distanceB;
  });
};

/**
 * Sort products by freshness
 * @param {Array} products - Array of products
 * @returns {Array} Sorted products
 */
export const sortByFreshness = (products) => {
  return [...products].sort((a, b) => {
    const freshnessA = calculateFreshness(a.harvestDate, a.cropType);
    const freshnessB = calculateFreshness(b.harvestDate, b.cropType);
    
    // Sort by days remaining (descending)
    if (freshnessA.daysRemaining === null && freshnessB.daysRemaining === null) return 0;
    if (freshnessA.daysRemaining === null) return 1;
    if (freshnessB.daysRemaining === null) return -1;
    
    return freshnessB.daysRemaining - freshnessA.daysRemaining;
  });
};

/**
 * Filter products by distance
 * @param {Array} products - Array of products
 * @param {Object} userLocation - User's current location
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered products
 */
export const filterByDistance = (products, userLocation, maxDistance = 50) => {
  if (!userLocation) return products;

  return products.filter(product => {
    if (!product.farmer?.location) return false;
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      product.farmer.location.lat,
      product.farmer.location.lng
    );
    
    return distance <= maxDistance;
  });
};
