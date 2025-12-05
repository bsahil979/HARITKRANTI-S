import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { placeholder } from "../assets";
import { useI18n } from "../context/I18nProvider";
import { 
  calculateDistance, 
  estimateDeliveryTime, 
  getDeliveryBadge, 
  calculateFreshness, 
  isFreshAndFast 
} from "../utils/gisUtils";

const ProductCard = ({ product, userLocation }) => {
  const dispatch = useDispatch();
  const { t } = useI18n();

  // Debug logging
  console.log("ProductCard received product:", product);
  console.log("Product images:", product?.images);

  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    // Show success message
    setTimeout(() => {
      // Optional: You can add a toast notification here
    }, 100);
  };

  // Calculate delivery and freshness information
  const getDeliveryInfo = () => {
    if (!userLocation || !product.farmer?.location) {
      return null;
    }

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      product.farmer.location.lat,
      product.farmer.location.lng
    );

    const deliveryTime = estimateDeliveryTime(distance);
    const deliveryBadge = getDeliveryBadge(distance);

    return {
      distance: Math.round(distance * 10) / 10,
      deliveryTime,
      deliveryBadge
    };
  };

  const getFreshnessInfo = () => {
    if (!product.harvestDate) return null;
    
    return calculateFreshness(product.harvestDate, product.cropType);
  };

  const deliveryInfo = getDeliveryInfo();
  const freshnessInfo = getFreshnessInfo();
  const isFreshAndFastProduct = isFreshAndFast(product, userLocation);

  return (
    <div className="card bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform duration-300">
      {/* Product Link */}
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          {product?.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title || product.name || "Product"}
              onError={handleImageError}
              className="w-full h-48 object-cover"
            />
          ) : (
            <img
              src={placeholder}
              alt="placeholder"
              className="w-full h-48 object-cover"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isOrganic && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                Organic
              </span>
            )}
            
            {/* Fresh & Fast Highlight */}
            {isFreshAndFastProduct && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                👉 🌾 {t("freshAndFast")}
              </span>
            )}
            
            {/* Delivery Badge */}
            {deliveryInfo && (
              <span className={`text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${
                deliveryInfo.deliveryBadge.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {deliveryInfo.deliveryBadge.emoji} {t(deliveryInfo.deliveryBadge.text.toLowerCase().replace(' ', ''))}
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 truncate">
            {product.title || product.name || "Unnamed Product"}
          </h3>
          <p className="text-gray-500 text-sm mb-2 truncate">
            {product.category?.name || product.category || "General"}
          </p>
          
          {/* Delivery Information */}
          {deliveryInfo && (
            <div className="mb-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span>🚚 {t("estimatedDelivery")}: {deliveryInfo.deliveryTime.time} {t(deliveryInfo.deliveryTime.unit)}</span>
                <span>📍 {deliveryInfo.distance} {t("km")}</span>
              </div>
            </div>
          )}
          
          {/* Freshness Information */}
          {freshnessInfo && (
            <div className="mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                freshnessInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                freshnessInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {freshnessInfo.emoji} {freshnessInfo.message}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">
              ₨{(product.pricePerKg || product.price || 0).toFixed(2)}{" "}
              {product.unit ? `/ ${product.unit}` : ""}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="m-4 space-y-2">
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
        >
          {t("addToCart")}
        </button>
        <Link
          to="/cart"
          className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-300"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
