"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  resetProductSuccess,
} from "../../redux/slices/productSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaArrowLeft, FaUpload, FaTimes } from "react-icons/fa";
import { 
  fileToBase64, 
  filesToBase64, 
  compressImage, 
  validateImageFile, 
  createImagePreview, 
  revokeImagePreview 
} from "../../utils/imageUtils";

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    pricePerKg: "",
    unit: "lb",
    quantityKg: "",
    images: [],
    isOrganic: false,
    harvestDate: "",
    availableUntil: "",
    isActive: true,
  });

  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
          revokeImagePreview(url);
        }
      });
    };
  }, [imagePreviewUrls]);

  useEffect(() => {
    if (success) {
      dispatch(resetProductSuccess());
      navigate("/farmer/products");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
    }
    
    // Limit to 5 images total
    if (imagePreviewUrls.length + files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    
    try {
      // Compress images and convert to base64
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file, 800, 600, 0.8))
      );
      
      const base64Images = await filesToBase64(compressedFiles);
      const newImagePreviewUrls = compressedFiles.map(file => createImagePreview(file));

      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
      setFormData({
        ...formData,
        images: [...formData.images, ...base64Images],
      });
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    }
  };

  const removeImage = (index) => {
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...formData.images];

    // Revoke the object URL to free memory
    if (newImagePreviewUrls[index]) {
      revokeImagePreview(newImagePreviewUrls[index]);
    }

    newImagePreviewUrls.splice(index, 1);
    newImages.splice(index, 1);

    setImagePreviewUrls(newImagePreviewUrls);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.pricePerKg || formData.pricePerKg <= 0)
      newErrors.pricePerKg = "Valid price is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.quantityKg || formData.quantityKg < 0)
      newErrors.quantityKg = "Valid quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(createProduct(formData));
    }
  };

  if (loading || categoriesLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/farmer/products"
        className="flex items-center text-green-500 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="glass p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${
                  errors.title ? "border-red-500" : ""
                } pl-3`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none cursor-pointer ${
                  errors.category ? "border-red-500" : ""
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
                required
              >
                <option value="">Select a category</option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories available</option>
                )}
              </select>
              {categoriesLoading && (
                <p className="text-gray-500 text-xs mt-1">Loading categories...</p>
              )}
              {!categoriesLoading && categories && categories.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">No categories found. Please contact admin.</p>
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className={`form-input ${
                errors.description ? "border-red-500" : ""
              } pl-3`}
              placeholder="Describe your product..."
              required
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="pricePerKg"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price per Kg*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₨</span>
                </div>
                <input
                  type="number"
                  id="pricePerKg"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  className={`form-input pl-7 ${
                    errors.pricePerKg ? "border-red-500" : ""
                  } pl-3`}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              {errors.pricePerKg && (
                <p className="text-red-500 text-xs mt-1">{errors.pricePerKg}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Unit*
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`form-input ${errors.unit ? "border-red-500" : ""}`}
                required
              >
                <option value="lb">Pound (lb)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="oz">Ounce (oz)</option>
                <option value="g">Gram (g)</option>
                <option value="each">Each</option>
                <option value="bunch">Bunch</option>
                <option value="dozen">Dozen</option>
                <option value="pint">Pint</option>
                <option value="quart">Quart</option>
                <option value="gallon">Gallon</option>
              </select>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1">{errors.unit}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="quantityKg"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity (Kg)*
              </label>
              <input
                type="number"
                id="quantityKg"
                name="quantityKg"
                value={formData.quantityKg}
                onChange={handleChange}
                className={`form-input ${
                  errors.quantityKg ? "border-red-500" : ""
                } pl-3`}
                min="0"
                required
              />
              {errors.quantityKg && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantityKg}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="harvestDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Harvest Date
              </label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="form-input pl-3"
              />
            </div>

            <div>
              <label
                htmlFor="availableUntil"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Until
              </label>
              <input
                type="date"
                id="availableUntil"
                name="availableUntil"
                value={formData.availableUntil}
                onChange={handleChange}
                className="form-input pl-3"
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOrganic"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isOrganic"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Organic
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <FaUpload className="text-gray-500" />
                  <span>Upload Images</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                Upload up to 5 images
              </span>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/farmer/products"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
