import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf, FaStar, FaCheckCircle, FaClock, FaAward } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";

const FarmerCard = ({ farmer }) => {
  const { t } = useI18n();

  // Helper to get profile image URL
  const getProfileImageUrl = () => {
    if (!farmer?.profileImage) return null;
    // If it already has data: prefix, use it as is
    if (farmer.profileImage.startsWith('data:')) {
      return farmer.profileImage;
    }
    // If it's a URL (http/https), use it as is
    if (farmer.profileImage.startsWith('http://') || farmer.profileImage.startsWith('https://')) {
      return farmer.profileImage;
    }
    // Otherwise, assume it's base64 and add the prefix
    return `data:image/jpeg;base64,${farmer.profileImage}`;
  };

  const profileImageUrl = getProfileImageUrl();

  const getVerificationBadge = () => {
    if (farmer.isVerified) {
      return (
        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
          <FaCheckCircle className="text-green-500" />
          <span>{t("verifiedFarmer")}</span>
        </div>
      );
    } else if (farmer.verificationStatus === "pending") {
      return (
        <div className="flex items-center gap-1 text-yellow-600 text-xs font-medium">
          <FaClock className="text-yellow-500" />
          <span>{t("pending")}</span>
        </div>
      );
    }
    return null;
  };

  const getTrustScore = () => {
    if (farmer.trustScore) {
      return (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FaStar className="text-yellow-400" />
          <span>{farmer.trustScore}/5.0</span>
          <span className="text-gray-400">({farmer.reviews} {t("reviews")})</span>
        </div>
      );
    }
    return null;
  };

  const getSpecialties = () => {
    if (farmer.profile?.specialties && farmer.profile.specialties.length > 0) {
      return (
        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">{t("specialties")}</div>
          <div className="flex flex-wrap gap-1">
            {farmer.profile.specialties.slice(0, 2).map((specialty, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {specialty}
              </span>
            ))}
            {farmer.profile.specialties.length > 2 && (
              <span className="text-xs text-gray-500">+{farmer.profile.specialties.length - 2} more</span>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const getCertifications = () => {
    if (farmer.profile?.certifications && farmer.profile.certifications.length > 0) {
      return (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {farmer.profile.certifications.map((cert, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                <FaAward className="text-blue-500" />
                {t(`${cert}Certified`)}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card transition-transform duration-300 hover:shadow-xl">
      <div className="p-6">
        {/* Header with Photo and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={farmer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className={`w-16 h-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200 ${profileImageUrl ? 'hidden' : 'flex'}`}
            >
              <FaLeaf className="text-green-500 text-2xl" />
            </div>
            
            {/* Verification Badge */}
            {getVerificationBadge() && (
              <div className="absolute -top-1 -right-1">
                {getVerificationBadge()}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">{farmer.name}</h3>
            {farmer.profile?.farmName && (
              <p className="text-sm text-gray-600 mb-1">{farmer.profile.farmName}</p>
            )}
            {farmer.address && (
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
            {getTrustScore()}
          </div>
        </div>

        {/* Experience and Farm Size */}
        <div className="mb-3 text-sm text-gray-600">
          {farmer.profile?.farmingExperience && (
            <div className="flex justify-between">
              <span>{t("farmingExperience")}:</span>
              <span className="font-medium">{farmer.profile.farmingExperience} {t("years")}</span>
            </div>
          )}
          {farmer.profile?.farmSize && (
            <div className="flex justify-between">
              <span>{t("farmSize")}:</span>
              <span className="font-medium">{farmer.profile.farmSize} {t(farmer.profile.farmSizeUnit || "acres")}</span>
            </div>
          )}
        </div>

        {/* Specialties */}
        {getSpecialties()}

        {/* Certifications */}
        {getCertifications()}

        {/* Bio Preview */}
        {farmer.profile?.bio && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {farmer.profile.bio.length > 100 
                ? `${farmer.profile.bio.substring(0, 100)}...` 
                : farmer.profile.bio
              }
            </p>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          {t("viewProfile")}
        </Link>
      </div>
    </div>
  );
};




export default FarmerCard;
