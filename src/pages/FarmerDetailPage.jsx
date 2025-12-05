"use client";

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useI18n } from "../context/I18nProvider";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaComment,
  FaCheckCircle,
  FaStar,
  FaAward,
  FaClock,
  FaWarehouse,
  FaShieldAlt,
  FaCamera,
  FaSeedling,
  FaTractor,
  FaWater,
  FaRecycle,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Debug logging
  console.log("FarmerDetailPage - Products:", products);
  console.log("FarmerDetailPage - Farmer ID:", id);

  useEffect(() => {
    console.log("Fetching farmer profile for ID:", id);
    dispatch(getFarmerProfile(id));
    console.log("Fetching products for farmer ID:", id);
    dispatch(getProducts({ farmer: id }));

    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        receiver: id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  if (loading || productsLoading) {
    return <Loader />;
  }

  if (!farmerProfile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">Farmer not found</span>
        </div>
        <Link
          to="/farmers"
          className="mt-4 inline-block text-green-500 hover:text-green-700"
        >
          Back to Farmers
        </Link>
      </div>
    );
  }

  const { farmer, profile } = farmerProfile;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/farmers"
        className="flex items-center text-green-500 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Farmers
      </Link>

      {/* Main Profile Header */}
      <div className="glass p-6 rounded-xl mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Profile Photo and Verification */}
          <div className="lg:w-1/4 flex flex-col items-center">
            <div className="relative">
              {(() => {
                // Helper to get profile image URL
                const getProfileImageUrl = () => {
                  if (!farmer?.profileImage) return null;
                  if (farmer.profileImage.startsWith('data:')) return farmer.profileImage;
                  if (farmer.profileImage.startsWith('http://') || farmer.profileImage.startsWith('https://')) {
                    return farmer.profileImage;
                  }
                  return `data:image/jpeg;base64,${farmer.profileImage}`;
                };
                const profileImageUrl = getProfileImageUrl();
                
                return profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={farmer.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null;
              })()}
              <div 
                className={`w-32 h-32 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-200 ${(() => {
                  if (!farmer?.profileImage) return 'flex';
                  const hasValidUrl = farmer.profileImage.startsWith('data:') || 
                                     farmer.profileImage.startsWith('http://') || 
                                     farmer.profileImage.startsWith('https://') ||
                                     farmer.profileImage.length > 0;
                  return hasValidUrl ? 'hidden' : 'flex';
                })()}`}
              >
                <FaLeaf className="text-green-500 text-4xl" />
              </div>
              
              {/* Verification Badge */}
              {farmer.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
                  <FaCheckCircle className="text-lg" />
                </div>
              )}
            </div>
            
            {/* Trust Score */}
            {farmer.trustScore && (
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold text-lg">{farmer.trustScore}</span>
                  <span className="text-gray-500">/5.0</span>
                </div>
                <div className="text-sm text-gray-600">
                  {farmer.reviews} {t("reviews")}
                </div>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="lg:w-3/4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">
                  {farmer.name}
                </h1>
                {profile?.farmName && (
                  <h2 className="text-xl text-green-600 font-semibold mb-2">
                    {profile.farmName}
                  </h2>
                )}
                
                {/* Verification Status */}
                <div className="flex items-center gap-2 mb-3">
                  {farmer.isVerified ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <FaCheckCircle />
                      {t("verifiedFarmer")}
                    </span>
                  ) : farmer.verificationStatus === "pending" ? (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                      <FaClock />
                      {t("pending")}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Contact Button */}
              {isAuthenticated && user?.role !== "farmer" && (
                <div className="mt-4 md:mt-0">
                  {showMessageForm ? (
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Write your message here..."
                        rows="3"
                        required
                      ></textarea>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                          {t("messageFarmer")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMessageForm(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowMessageForm(true)}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      <FaComment />
                      <span>{t("contactFarmer")}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {farmer.address && (
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-green-500 mr-2" />
                  <span>
                    {farmer.address.city}, {farmer.address.state}
                  </span>
                </div>
              )}
              {farmer.phone && (
                <div className="flex items-center text-gray-600">
                  <FaPhone className="text-green-500 mr-2" />
                  <span>{farmer.phone}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <FaEnvelope className="text-green-500 mr-2" />
                <span>{farmer.email}</span>
              </div>
              {farmer.responseTime && (
                <div className="flex items-center text-gray-600">
                  <FaClock className="text-green-500 mr-2" />
                  <span>{t("responseTime")}: {farmer.responseTime} {t("withinHours")}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{t("bio")}</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Social Media */}
            {profile?.socialMedia && (
              <div className="flex space-x-4 mb-4">
                {profile.socialMedia.facebook && (
                  <a
                    href={profile.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                )}
                {profile.socialMedia.instagram && (
                  <a
                    href={profile.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                )}
                {profile.socialMedia.twitter && (
                  <a
                    href={profile.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Farm Details Grid */}
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Farm Information */}
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaSeedling className="text-green-500" />
              {t("farmingBackground")}
            </h2>
            <div className="space-y-3">
              {profile.farmingExperience && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("farmingExperience")}:</span>
                  <span className="font-medium">{profile.farmingExperience} {t("years")}</span>
                </div>
              )}
              {profile.establishedYear && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("establishedSince")}:</span>
                  <span className="font-medium">{profile.establishedYear}</span>
                </div>
              )}
              {profile.farmSize && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("farmSize")}:</span>
                  <span className="font-medium">{profile.farmSize} {t(profile.farmSizeUnit || "acres")}</span>
                </div>
              )}
              {profile.region && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("region")}:</span>
                  <span className="font-medium">{profile.region}</span>
                </div>
              )}
            </div>
          </div>

          {/* Crops and Specialties */}
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaLeaf className="text-green-500" />
              {t("cropsGrown")}
            </h2>
            <div className="space-y-3">
              {profile.cropsGrown && profile.cropsGrown.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">{t("cropsGrown")}:</div>
                  <div className="flex flex-wrap gap-1">
                    {profile.cropsGrown.map((crop, index) => (
                      <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.specialties && profile.specialties.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">{t("specialties")}:</div>
                  <div className="flex flex-wrap gap-1">
                    {profile.specialties.map((specialty, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certifications and Awards */}
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaAward className="text-green-500" />
              {t("certifications")}
            </h2>
            <div className="space-y-3">
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">{t("certifications")}:</div>
                  <div className="space-y-1">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FaAward className="text-blue-500" />
                        <span>{t(`${cert}Certified`)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {profile.awards && profile.awards.length > 0 && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">{t("awards")}:</div>
                  <div className="space-y-1">
                    {profile.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FaAward className="text-yellow-500" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Farming Practices */}
      {profile?.farmingPractices && profile.farmingPractices.length > 0 && (
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaTractor className="text-green-500" />
            {t("farmingMethods")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.farmingPractices.map((practice, index) => (
              <div key={index} className="flex items-start gap-3">
                <FaLeaf className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farm Photos */}
      {profile?.farmPhotos && profile.farmPhotos.length > 0 && (
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCamera className="text-green-500" />
            {t("farmPhotos")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.farmPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Farm photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                  <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality Assurance Section */}
      <div className="glass p-6 rounded-xl mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaShieldAlt className="text-green-500" />
          {t("qualityAssurance")}
        </h2>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <FaWarehouse className="text-green-500 text-2xl" />
          </div>
          <div>
            <p className="text-gray-700 leading-relaxed mb-3">
              {t("warehouseNote")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCheckCircle className="text-green-500" />
                <span>Quality Inspection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaShieldAlt className="text-green-500" />
                <span>Freshness Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaWarehouse className="text-green-500" />
                <span>Safe Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Available Products</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 glass rounded-xl">
            <FaLeaf className="text-green-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Products Available
            </h3>
            <p className="text-gray-600">
              This farmer doesn't have any products listed at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDetailPage;
