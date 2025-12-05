"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/slices/productSlice";
import { createPurchase, getAllPurchases } from "../../redux/slices/purchaseSlice";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaShoppingCart,
  FaBox,
  FaUser,
  FaMapMarkerAlt,
  FaCheck,
  FaHistory,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const PurchasePage = () => {
  const dispatch = useDispatch();
  const { products = [], loading: productsLoading = false } = useSelector((state) => state.products || {});
  const { purchases = [], loading: purchasesLoading = false } = useSelector((state) => state.purchases || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseForm, setPurchaseForm] = useState({
    quantity: "",
    purchasePrice: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(getProducts({ limit: 1000 }));
    dispatch(getAllPurchases());
  }, [dispatch]);

  const handlePurchaseClick = (item) => {
    setSelectedItem(item);
    setPurchaseForm({
      quantity: item.quantityAvailable || item.quantityKg || item.quantity || "",
      purchasePrice: item.pricePerKg || item.price || "",
      notes: "",
    });
    setShowPurchaseModal(true);
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const purchaseData = {
      productId: selectedItem._id,
      quantity: parseFloat(purchaseForm.quantity),
      purchasePrice: parseFloat(purchaseForm.purchasePrice),
      notes: purchaseForm.notes,
    };

    try {
      await dispatch(createPurchase(purchaseData)).unwrap();
      // Refresh products and purchases to show updated data
      dispatch(getProducts({ limit: 1000 }));
      dispatch(getAllPurchases());
      setShowPurchaseModal(false);
      setSelectedItem(null);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  // Filter out products that are completely purchased (quantity = 0)
  const availableProducts = (Array.isArray(products) ? products : []).filter((item) => {
    const availableQty = item.quantityAvailable || item.quantityKg || item.quantity || 0;
    // Remove products with 0 quantity (completely purchased)
    return availableQty > 0;
  });

  const filteredItems = availableProducts.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        (item.name || item.title || "").toLowerCase().includes(search) ||
        (item.description || "").toLowerCase().includes(search) ||
        (item.farmer?.name || item.farmerId?.name || "").toLowerCase().includes(search)
      );
    }
    return true;
  });

  const categories = [
    ...new Set((Array.isArray(products) ? products : []).map((p) => p.category).filter(Boolean)),
  ];

  // Calculate total spent
  const totalSpent = purchases.reduce((sum, purchase) => {
    return sum + (purchase.totalAmount || 0);
  }, 0);

  if (productsLoading && products.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Purchase from Farmers</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-outline flex items-center space-x-2"
          >
            <FaHistory />
            <span>Transaction History ({purchases.length})</span>
          </button>
          <div className="text-sm text-gray-600">
            Available: {filteredItems.length} products
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      {showHistory && (
        <div className="glass p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <FaHistory className="text-green-600" />
              <span>Purchase History</span>
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">₨{totalSpent.toFixed(2)}</p>
            </div>
          </div>

          {purchasesLoading ? (
            <Loader />
          ) : purchases.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Farmer</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>
                            {new Date(purchase.createdAt || purchase.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(purchase.createdAt || purchase.purchaseDate).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {purchase.product?.name || purchase.product?.title || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {purchase.product?.category || ""}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-gray-400" />
                          <span className="text-sm">{purchase.farmer?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {purchase.quantity} {purchase.unit || "kg"}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        ₨{purchase.purchasePrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="font-semibold text-green-600">
                            ₨{purchase.totalAmount?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            purchase.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {purchase.status || "completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FaHistory className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No purchase history yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products/listings..."
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
        </div>
      </div>

      {/* Available Products Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {item.name || item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description || "No description"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden ml-3">
                  {(item.images && item.images.length > 0) || item.imageUrl ? (
                    <img
                      src={item.images?.[0] || item.imageUrl}
                      alt={item.name || item.title}
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
                <div className="flex items-center text-sm">
                  <FaUser className="text-gray-400 mr-2" />
                  <span className="font-medium">Farmer:</span>
                  <span className="ml-2">{item.farmer?.name || item.farmerId?.name || "Unknown"}</span>
                </div>
                {item.location && (item.location.district || item.location.state) && (
                  <div className="flex items-center text-sm">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <span>
                      {item.location.district || ""}
                      {item.location.district && item.location.state ? ", " : ""}
                      {item.location.state || ""}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">Price:</span> ₨
                    {(item.pricePerKg || item.price || 0).toFixed(2)}/
                    {item.unit || "kg"}
                  </span>
                  <span>
                    <span className="font-medium">Available:</span>{" "}
                    {item.quantityAvailable || item.quantityKg || item.quantity || 0} {item.unit || "kg"}
                  </span>
                </div>
                {item.status && (
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded ${
                      item.status === "available" ? "bg-green-100 text-green-800" :
                      item.status === "reserved" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handlePurchaseClick(item)}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>Purchase Product</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaBox className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== "all"
              ? "No products match your search criteria."
              : "No products available from farmers."}
          </p>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Purchase Product</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedItem.name || selectedItem.title}</p>
              <p className="text-sm text-gray-600">
                From: {selectedItem.farmer?.name || selectedItem.farmerId?.name || "Unknown Farmer"}
              </p>
            </div>
            <form onSubmit={handlePurchaseSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity ({selectedItem.unit || "kg"})*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedItem.quantityAvailable || selectedItem.quantityKg || selectedItem.quantity || 0}
                  value={purchaseForm.quantity}
                  onChange={(e) =>
                    setPurchaseForm({ ...purchaseForm, quantity: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {selectedItem.quantityAvailable || selectedItem.quantityKg || selectedItem.quantity || 0}{" "}
                  {selectedItem.unit || "kg"}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price per {selectedItem.unit || "kg"} (₨)*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={purchaseForm.purchasePrice}
                  onChange={(e) =>
                    setPurchaseForm({ ...purchaseForm, purchasePrice: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Farmer's price: ₨
                  {(selectedItem.pricePerKg || selectedItem.price || 0).toFixed(2)}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <div className="p-3 bg-green-50 rounded-lg font-semibold text-green-700">
                  ₨
                  {(
                    (parseFloat(purchaseForm.quantity) || 0) *
                    (parseFloat(purchaseForm.purchasePrice) || 0)
                  ).toFixed(2)}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={purchaseForm.notes}
                  onChange={(e) =>
                    setPurchaseForm({ ...purchaseForm, notes: e.target.value })
                  }
                  className="form-input w-full"
                  rows="3"
                  placeholder="Add any notes about this purchase..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaCheck />
                  <span>Confirm Purchase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;

