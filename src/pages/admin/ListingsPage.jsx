"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllListings,
  deleteListing,
  updateListing,
} from "../../redux/slices/listingSlice";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaBox,
  FaEdit,
} from "react-icons/fa";

const ListingsPage = () => {
  const dispatch = useDispatch();
  const { listings, loading, total } = useSelector((state) => state.listings);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState({ state: "", district: "" });
  const [filteredListings, setFilteredListings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listingToEdit, setListingToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    dispatch(getAllListings({ limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (listings) {
      let filtered = [...listings];

      if (categoryFilter !== "all") {
        filtered = filtered.filter((listing) => listing.category === categoryFilter);
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((listing) => listing.status === statusFilter);
      }

      if (locationFilter.state) {
        filtered = filtered.filter(
          (listing) => listing.location?.state === locationFilter.state
        );
      }

      if (locationFilter.district) {
        filtered = filtered.filter(
          (listing) => listing.location?.district === locationFilter.district
        );
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (listing) =>
            listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredListings(filtered);
    }
  }, [listings, searchTerm, categoryFilter, statusFilter, locationFilter]);

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (listingToDelete) {
      dispatch(deleteListing(listingToDelete._id));
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  const handleEditClick = (listing) => {
    setListingToEdit(listing);
    setEditFormData({
      title: listing.title || "",
      description: listing.description || "",
      pricePerKg: listing.pricePerKg || 0,
      quantityKg: listing.quantityKg || 0,
      category: listing.category || "other",
      status: listing.status || "available",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (listingToEdit) {
      dispatch(updateListing({ id: listingToEdit._id, listingData: editFormData }));
      setShowEditModal(false);
      setListingToEdit(null);
    }
  };

  const handleStatusChange = (listing, newStatus) => {
    dispatch(updateListing({ id: listing._id, listingData: { status: newStatus } }));
  };

  const toggleDetails = (listingId) => {
    setShowDetails(showDetails === listingId ? null : listingId);
  };

  const categories = [
    "grains",
    "vegetables",
    "fruits",
    "pulses",
    "spices",
    "oilseeds",
    "other",
  ];

  const states = [...new Set(listings.map((l) => l.location?.state).filter(Boolean))];
  const districts = [
    ...new Set(
      listings
        .filter((l) => !locationFilter.state || l.location?.state === locationFilter.state)
        .map((l) => l.location?.district)
        .filter(Boolean)
    ),
  ];

  if (loading && listings.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Listings</h1>
        <div className="text-sm text-gray-600">
          Total: {filteredListings.length} / {total || listings.length}
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings..."
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
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <select
              value={locationFilter.state}
              onChange={(e) =>
                setLocationFilter({ ...locationFilter, state: e.target.value, district: "" })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {locationFilter.state && (
          <div className="mt-4">
            <select
              value={locationFilter.district}
              onChange={(e) =>
                setLocationFilter({ ...locationFilter, district: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Listings Table */}
      {filteredListings.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
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
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <React.Fragment key={listing._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                            {listing.images && listing.images.length > 0 ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBox className="text-green-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{listing.title}</div>
                            <div className="text-sm text-gray-500">
                              {listing.category || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {listing.farmer?.name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.farmer?.email || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" />
                          <div className="text-sm">
                            {listing.location?.district || "N/A"}
                            {listing.location?.state && (
                              <span className="text-gray-500">, {listing.location.state}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium">
                        ₨{listing.pricePerKg?.toFixed(2) || "0.00"}/kg
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-medium">
                          {listing.quantityKg || 0} kg
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={listing.status || "available"}
                          onChange={(e) => handleStatusChange(listing, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${
                            listing.status === "available"
                              ? "bg-green-100 text-green-800"
                              : listing.status === "reserved"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleDetails(listing._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditClick(listing)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(listing)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showDetails === listing._id && (
                      <tr className="bg-gray-50">
                        <td colSpan="7" className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Listing Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">ID:</span> {listing._id}
                                </p>
                                <p>
                                  <span className="font-medium">Description:</span>{" "}
                                  {listing.description || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Created:</span>{" "}
                                  {new Date(listing.createdAt).toLocaleDateString()}
                                </p>
                                {listing.images && listing.images.length > 0 && (
                                  <div className="mt-2">
                                    <span className="font-medium">Images:</span>
                                    <div className="flex space-x-2 mt-1">
                                      {listing.images.map((img, idx) => (
                                        <img
                                          key={idx}
                                          src={img}
                                          alt={`${listing.title} ${idx + 1}`}
                                          className="w-16 h-16 object-cover rounded"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Farmer Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {listing.farmer?.name || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Email:</span>{" "}
                                  {listing.farmer?.email || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {listing.farmer?.phone || "N/A"}
                                </p>
                                <p>
                                  <span className="font-medium">Location:</span>{" "}
                                  {listing.location?.pincode || "N/A"}
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
          <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
              ? "No listings match your search criteria."
              : "There are no listings in the system yet."}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && listingToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Listing</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="form-input w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  className="form-input w-full"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price/Kg*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.pricePerKg}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        pricePerKg: parseFloat(e.target.value),
                      })
                    }
                    className="form-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg)*
                  </label>
                  <input
                    type="number"
                    value={editFormData.quantityKg}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        quantityKg: parseFloat(e.target.value),
                      })
                    }
                    className="form-input w-full"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, category: e.target.value })
                  }
                  className="form-input w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, status: e.target.value })
                  }
                  className="form-input w-full"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
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
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Update Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the listing{" "}
              <span className="font-medium">{listingToDelete?.title}</span>? This action
              cannot be undone.
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

export default ListingsPage;




