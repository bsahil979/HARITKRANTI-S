"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct, updateProduct } from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { FaSearch, FaEdit, FaTrash, FaBox, FaEye, FaCheck, FaTimes } from "react-icons/fa";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products = [], loading = false } = useSelector((state) => state.products || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [listFilter, setListFilter] = useState("all"); // all, pending, listed
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [productToApprove, setProductToApprove] = useState(null);
  const [approvePrice, setApprovePrice] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && Array.isArray(products)) {
      let filtered = [...products];

      if (categoryFilter !== "all") {
        filtered = filtered.filter((product) => product.category === categoryFilter);
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((product) => {
          if (product.status) return product.status === statusFilter;
          return statusFilter === "available";
        });
      }

      // Filter by listing status
      if (listFilter === "pending") {
        filtered = filtered.filter((product) => !product.isListed || product.status === "pending");
      } else if (listFilter === "listed") {
        filtered = filtered.filter((product) => product.isListed === true);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            (product.name || product.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.farmer?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchTerm, categoryFilter, statusFilter, listFilter]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id || productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const toggleDetails = (productId) => {
    setShowDetails(showDetails === productId ? null : productId);
  };

  const handleStatusChange = (product, newStatus) => {
    dispatch(updateProduct({ id: product._id || product.id, productData: { status: newStatus } }));
  };

  const handleApproveClick = (product) => {
    setProductToApprove(product);
    setApprovePrice(product.pricePerKg || product.price || "");
    setShowApproveModal(true);
  };

  const handleApproveProduct = async () => {
    if (!productToApprove || !approvePrice || approvePrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/products/${productToApprove._id || productToApprove.id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          approvedPrice: parseFloat(approvePrice),
          pricePerKg: parseFloat(approvePrice),
        }),
      });

      if (response.ok) {
        dispatch(getProducts()); // Refresh products list
        setShowApproveModal(false);
        setProductToApprove(null);
        setApprovePrice("");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to approve product");
      }
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Failed to approve product");
    }
  };

  if (loading && products.length === 0) {
    return <Loader />;
  }

  // Get unique categories
  const categories = products && Array.isArray(products) 
    ? [...new Set(products.map((p) => p.category).filter(Boolean))]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="text-sm text-gray-600">
          Total: {filteredProducts.length} / {products.length}
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <select
              value={listFilter}
              onChange={(e) => setListFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Products</option>
              <option value="pending">Pending Approval</option>
              <option value="listed">Listed in Marketplace</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listed
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <React.Fragment key={product._id || product.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0] || product.imageUrl}
                                alt={product.name || product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBox className="text-green-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name || product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description
                                ? product.description.substring(0, 50) + "..."
                                : "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {product.farmer?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.farmer?.email || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        ₨{((product.pricePerKg || product.price || 0).toFixed(2))}
                        {product.pricePerKg && "/kg"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`${
                            (product.quantityAvailable || product.quantity || 0) === 0
                              ? "text-red-500"
                              : (product.quantityAvailable || product.quantity || 0) < 5
                              ? "text-orange-500"
                              : "text-green-500"
                          } font-medium`}
                        >
                          {product.quantityAvailable || product.quantity || 0}{" "}
                          {product.unit || "kg"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={product.status || "pending"}
                          onChange={(e) => handleStatusChange(product, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${
                            product.status === "available"
                              ? "bg-green-100 text-green-800"
                              : product.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : product.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.isListed ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Listed
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {!product.isListed && (
                            <button
                              onClick={() => handleApproveClick(product)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve & List"
                            >
                              <FaCheck />
                            </button>
                          )}
                          <button
                            onClick={() => toggleDetails(product._id || product.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showDetails === (product._id || product.id) && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Product Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">ID:</span>{" "}
                                  {product._id || product.id}
                                </p>
                                <p>
                                  <span className="font-medium">Description:</span>{" "}
                                  {product.description || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Location:</span>{" "}
                                  {product.location
                                    ? `${product.location.district || ""}, ${product.location.state || ""}`
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Farmer Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {product.farmer?.name || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {product.farmer?.email || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {product.farmer?.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaBox className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
              ? "No products match your search criteria."
              : "There are no products in the system yet."}
          </p>
        </div>
      )}

      {/* Approve Product Modal */}
      {showApproveModal && productToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Approve & List Product</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Product: <span className="font-medium">{productToApprove.name || productToApprove.title}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Farmer's Suggested Price: ₨{((productToApprove.pricePerKg || productToApprove.price || 0).toFixed(2))}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Set Marketplace Price (₨)
              </label>
              <input
                type="number"
                value={approvePrice}
                onChange={(e) => setApprovePrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setProductToApprove(null);
                  setApprovePrice("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve & List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the product{" "}
              <span className="font-medium">{productToDelete?.name || productToDelete?.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

