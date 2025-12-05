"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllInventory,
  updateInventory,
  listProductInMarketplace,
} from "../../redux/slices/inventorySlice";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaBox,
  FaEdit,
  FaStore,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";

const InventoryPage = () => {
  const dispatch = useDispatch();
  const { inventory, loading } = useSelector((state) => state.inventory);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showListModal, setShowListModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listForm, setListForm] = useState({
    sellingPrice: "",
    quantity: "",
  });
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    dispatch(getAllInventory());
  }, [dispatch]);

  useEffect(() => {
    let filtered = [...inventory];

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sourceFarmer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, statusFilter]);

  const handleListClick = (item) => {
    setSelectedItem(item);
    setListForm({
      sellingPrice: item.sellingPrice || item.purchasePrice * 1.2,
      quantity: item.availableQuantity || item.totalQuantity,
    });
    setShowListModal(true);
  };

  const handleListSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    dispatch(
      listProductInMarketplace({
        inventoryId: selectedItem._id,
        sellingPrice: parseFloat(listForm.sellingPrice),
        quantity: parseFloat(listForm.quantity),
      })
    );
    setShowListModal(false);
    setSelectedItem(null);
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditForm({
      sellingPrice: item.sellingPrice,
      warehouseLocation: item.warehouseLocation || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    dispatch(
      updateInventory({
        id: selectedItem._id,
        inventoryData: editForm,
      })
    );
    setShowEditModal(false);
    setSelectedItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "listed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && inventory.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="text-sm text-gray-600">
          Total: {filteredInventory.length} / {inventory.length} items
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Total Inventory</div>
          <div className="text-2xl font-bold">
            {inventory.reduce((sum, item) => sum + (item.totalQuantity || 0), 0)}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-green-600">
            {inventory.reduce((sum, item) => sum + (item.availableQuantity || 0), 0)}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Sold</div>
          <div className="text-2xl font-bold text-blue-600">
            {inventory.reduce((sum, item) => sum + (item.soldQuantity || 0), 0)}
          </div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-gray-600 mb-1">Listed</div>
          <div className="text-2xl font-bold text-purple-600">
            {inventory.filter((item) => item.status === "listed").length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="listed">Listed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Quantities
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Pricing
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaBox className="text-green-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{item.sourceFarmer?.name || "N/A"}</div>
                        <div className="text-gray-500">
                          Purchase: ₨{item.purchasePrice?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm">
                        <div>
                          <span className="font-medium">Total:</span> {item.totalQuantity}{" "}
                          {item.unit}
                        </div>
                        <div className="text-green-600">
                          <span className="font-medium">Available:</span>{" "}
                          {item.availableQuantity} {item.unit}
                        </div>
                        <div className="text-blue-600">
                          <span className="font-medium">Sold:</span> {item.soldQuantity}{" "}
                          {item.unit}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm">
                        <div>
                          <span className="font-medium">Selling:</span> ₨
                          {item.sellingPrice?.toFixed(2) || "0.00"}
                        </div>
                        <div className="text-gray-500 text-xs">
                          Markup: ₨
                          {((item.sellingPrice || 0) - (item.purchasePrice || 0)).toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status.replace("_", " ").toUpperCase()}
                      </span>
                      {item.availableQuantity < 10 && item.availableQuantity > 0 && (
                        <div className="mt-1">
                          <FaExclamationTriangle className="text-yellow-500 text-xs mx-auto" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        {item.status !== "listed" && item.availableQuantity > 0 && (
                          <button
                            onClick={() => handleListClick(item)}
                            className="text-green-600 hover:text-green-900"
                            title="List in Marketplace"
                          >
                            <FaStore />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaBox className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Inventory Items</h3>
          <p className="text-gray-600">
            Purchase products from farmers to add them to your inventory.
          </p>
        </div>
      )}

      {/* List in Marketplace Modal */}
      {showListModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">List Product in Marketplace</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedItem.name}</p>
              <p className="text-sm text-gray-600">
                Available: {selectedItem.availableQuantity} {selectedItem.unit}
              </p>
            </div>
            <form onSubmit={handleListSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price per {selectedItem.unit} (₨)*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={listForm.sellingPrice}
                  onChange={(e) =>
                    setListForm({ ...listForm, sellingPrice: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Purchase price: ₨{selectedItem.purchasePrice?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity to List ({selectedItem.unit})*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedItem.availableQuantity}
                  value={listForm.quantity}
                  onChange={(e) =>
                    setListForm({ ...listForm, quantity: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {selectedItem.availableQuantity} {selectedItem.unit}
                </p>
              </div>
              <div className="mb-6">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-700">
                    Estimated Revenue: ₨
                    {(
                      parseFloat(listForm.quantity || 0) *
                      parseFloat(listForm.sellingPrice || 0)
                    ).toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    Profit: ₨
                    {(
                      parseFloat(listForm.quantity || 0) *
                      (parseFloat(listForm.sellingPrice || 0) -
                        (selectedItem.purchasePrice || 0))
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaStore />
                  <span>List in Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Inventory Item</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price per {selectedItem.unit} (₨)*
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.sellingPrice}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sellingPrice: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warehouse Location
                </label>
                <input
                  type="text"
                  value={editForm.warehouseLocation}
                  onChange={(e) =>
                    setEditForm({ ...editForm, warehouseLocation: e.target.value })
                  }
                  className="form-input w-full"
                  placeholder="Enter warehouse location..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;




