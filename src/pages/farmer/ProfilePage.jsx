"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/slices/authSlice";
import { FaUser, FaCamera, FaSave, FaArrowLeft } from "react-icons/fa";
import { 
  fileToBase64, 
  compressImage, 
  validateImageFile, 
  createImagePreview, 
  revokeImagePreview 
} from "../../utils/imageUtils";
import Loader from "../../components/Loader";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    },
    farmDetails: {
      farmName: "",
      farmSize: "",
      crops: [],
      certification: []
    },
    profileImage: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
          country: user.address?.country || "India"
        },
        farmDetails: {
          farmName: user.farmDetails?.farmName || "",
          farmSize: user.farmDetails?.farmSize || "",
          crops: user.farmDetails?.crops || [],
          certification: user.farmDetails?.certification || []
        },
        profileImage: user.profileImage || ""
      });
      
      // Set image preview from user's profileImage
      if (user.profileImage) {
        // If it's already a data URL or HTTP URL, use it directly
        if (user.profileImage.startsWith('data:') || 
            user.profileImage.startsWith('http://') || 
            user.profileImage.startsWith('https://')) {
          setImagePreview(user.profileImage);
        } else {
          // Otherwise, assume it's base64 and add the prefix
          setImagePreview(`data:image/jpeg;base64,${user.profileImage}`);
        }
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      // Compress and convert to base64
      const compressedFile = await compressImage(file, 400, 400, 0.8);
      const base64Image = await fileToBase64(compressedFile);
      
      // Create preview
      const previewUrl = createImagePreview(compressedFile);
      
      setFormData(prev => ({
        ...prev,
        profileImage: base64Image
      }));
      
      setImagePreview(previewUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(updateProfile(formData)).unwrap();
        // Profile updated successfully - the user state will be updated automatically
        // The image preview will persist since it's already set
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      revokeImagePreview(imagePreview);
    }
    setImagePreview("");
    setFormData(prev => ({
      ...prev,
      profileImage: ""
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return <Loader />;
  }

    if (!user) {
      navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-500 hover:text-green-700 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Farmer Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover border-4 border-green-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200 shadow-lg">
                      <FaUser className="text-green-500 text-5xl" />
                    </div>
                  )}
                  
                  <label 
                    className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-3 cursor-pointer hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-110"
                    title="Click to upload profile picture"
                  >
                    <FaCamera className="text-lg" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="block">
                    <span className="btn btn-outline w-full cursor-pointer flex items-center justify-center space-x-2">
                      <FaCamera />
                      <span>{imagePreview ? "Change Picture" : "Upload Picture"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </span>
                  </label>
                  
                  {imagePreview && (
                    <button
                      onClick={removeImage}
                      className="w-full text-red-500 hover:text-red-700 text-sm font-medium py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove Image
                    </button>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? "border-red-500" : ""}`}
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? "border-red-500" : ""}`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Farm Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Farm Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmDetails.farmName"
                        value={formData.farmDetails.farmName}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Size
                      </label>
                      <input
                        type="text"
                        name="farmDetails.farmSize"
                        value={formData.farmDetails.farmSize}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="e.g., 5 acres"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center"
                    disabled={loading}
                  >
                    <FaSave className="mr-2" />
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;