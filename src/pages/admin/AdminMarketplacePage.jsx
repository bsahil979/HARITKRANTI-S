"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../redux/slices/inventorySlice";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaBox,
  FaEdit,
  FaTrash,
  FaEye,
  FaStore,
} from "react-icons/fa";

const AdminMarketplacePage = () => {
  const dispatch = useDispatch();
  const { adminProducts, loading } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(getAdminProducts({ status: "available" }));
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...adminProducts];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [adminProducts, searchTerm, categoryFilter, statusFilter]);

  const categories = [...new Set(adminProducts.map((p) => p.category).filter(Boolean))];

  if (loading && adminProducts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Marketplace Products</h1>
        <div className="text-sm text-gray-600">
          Total Listed: {filteredProducts.length} / {adminProducts.length}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Total Products</div>
          <div className="text-2xl font-bold">{adminProducts.length}</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">
            {adminProducts.filter((p) => p.status === "available").length}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">
            {adminProducts.filter((p) => p.status === "out_of_stock").length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="glass p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description || "No description"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden ml-3">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">Price:</span> ₨{product.price?.toFixed(2) || "0.00"}
                    {product.pricePerKg && "/kg"}
                  </span>
                  <span>
                    <span className="font-medium">Available:</span> {product.quantity}{" "}
                    {product.unit}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {product.category}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      product.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                {product.adminMarkup && (
                  <div className="text-xs text-gray-500">
                    Markup: ₨{product.adminMarkup.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`/products/${product._id}`, "_blank")}
                  className="flex-1 btn btn-outline flex items-center justify-center space-x-2"
                >
                  <FaEye />
                  <span>View</span>
                </button>
                <button
                  className="flex-1 btn bg-green-600 text-white hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaStore className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Listed</h3>
          <p className="text-gray-600 mb-4">
            List products from your inventory to make them available to customers.
          </p>
          <a
            href="/admin/inventory"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <FaBox />
            <span>Go to Inventory</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default AdminMarketplacePage;




