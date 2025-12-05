"use client";

import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaFilter,
  FaEye,
  FaEdit,
} from "react-icons/fa";

// Mock reports data - In real app, this would come from Redux/API
const mockReports = [
  {
    _id: "1",
    type: "product",
    reportedBy: { name: "John Doe", email: "john@example.com", role: "consumer" },
    reportedItem: { type: "Product", name: "Organic Tomatoes", id: "prod123" },
    reason: "Incorrect product description",
    description: "The product description says organic but it's not certified",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    adminNotes: "",
  },
  {
    _id: "2",
    type: "order",
    reportedBy: { name: "Jane Smith", email: "jane@example.com", role: "consumer" },
    reportedItem: { type: "Order", name: "Order #12345", id: "order123" },
    reason: "Order not delivered",
    description: "Order was supposed to be delivered 3 days ago but still not received",
    status: "in_progress",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    adminNotes: "Contacted farmer, investigating delivery issue",
  },
  {
    _id: "3",
    type: "user",
    reportedBy: { name: "Bob Wilson", email: "bob@example.com", role: "farmer" },
    reportedItem: { type: "User", name: "Alice Johnson", id: "user456" },
    reason: "Inappropriate behavior",
    description: "User sent harassing messages",
    status: "resolved",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    adminNotes: "User warned, messages deleted",
  },
  {
    _id: "4",
    type: "message",
    reportedBy: { name: "Charlie Brown", email: "charlie@example.com", role: "consumer" },
    reportedItem: { type: "Message", name: "Conversation", id: "msg789" },
    reason: "Spam",
    description: "Received multiple spam messages from this user",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    adminNotes: "",
  },
];

const ReportsPage = () => {
  const [reports, setReports] = useState(mockReports);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [showNotesModal, setShowNotesModal] = useState(false);

  useEffect(() => {
    // In real app, dispatch action to fetch reports
    // dispatch(getAllReports());
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.reportedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.reportedBy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, typeFilter]);

  const handleStatusChange = (reportId, newStatus) => {
    setReports(
      reports.map((report) =>
        report._id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setAdminNotes(report.adminNotes || "");
    setShowDetails(true);
  };

  const handleAddNotes = () => {
    if (selectedReport) {
      setReports(
        reports.map((report) =>
          report._id === selectedReport._id
            ? { ...report, adminNotes: adminNotes }
            : report
        )
      );
      setShowNotesModal(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "in_progress":
        return <FaExclamationCircle className="text-blue-500" />;
      case "resolved":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusCounts = {
    all: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    in_progress: reports.filter((r) => r.status === "in_progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports & Complaints</h1>
        <div className="text-sm text-gray-600">
          Total: {filteredReports.length} / {reports.length}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className="glass p-4 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setStatusFilter(status)}
          >
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-gray-600 capitalize">{status.replace("_", " ")}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="product">Product</option>
              <option value="order">Order</option>
              <option value="user">User</option>
              <option value="message">Message</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report._id} className="glass p-6 rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(report.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                      {report.type.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{report.reason}</h3>
                  <p className="text-gray-600 mb-4">{report.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Reported By:</span>{" "}
                      {report.reportedBy.name} ({report.reportedBy.email})
                    </div>
                    <div>
                      <span className="font-medium">Reported Item:</span>{" "}
                      {report.reportedItem.name}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Days Ago:</span>{" "}
                      {Math.floor(
                        (Date.now() - new Date(report.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </div>
                  </div>

                  {report.adminNotes && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium">Admin Notes:</span>{" "}
                        {report.adminNotes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleViewDetails(report)}
                    className="text-blue-600 hover:text-blue-900 p-2"
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReport(report);
                      setAdminNotes(report.adminNotes || "");
                      setShowNotesModal(true);
                    }}
                    className="text-green-600 hover:text-green-900 p-2"
                    title="Add Notes"
                  >
                    <FaEdit />
                  </button>
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border-0 ${getStatusColor(
                      report.status
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaExclamationCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Reports Found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "No reports match your search criteria."
              : "There are no reports in the system yet."}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Report Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Report Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span> {selectedReport.type}
                  </div>
                  <div>
                    <span className="font-medium">Reason:</span> {selectedReport.reason}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedReport.description}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    <span className={getStatusColor(selectedReport.status)}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Reported By</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedReport.reportedBy.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedReport.reportedBy.email}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    {selectedReport.reportedBy.role}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Reported Item</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedReport.reportedItem.type}
                  </div>
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedReport.reportedItem.name}
                  </div>
                  <div>
                    <span className="font-medium">ID:</span>{" "}
                    {selectedReport.reportedItem.id}
                  </div>
                </div>
              </div>

              {selectedReport.adminNotes && (
                <div>
                  <h4 className="font-medium mb-2">Admin Notes</h4>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    {selectedReport.adminNotes}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedReport(selectedReport);
                    setAdminNotes(selectedReport.adminNotes || "");
                    setShowNotesModal(true);
                    setShowDetails(false);
                  }}
                  className="btn btn-outline flex-1"
                >
                  Add/Edit Notes
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="btn bg-gray-600 text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="form-input w-full mb-4"
              rows="4"
              placeholder="Add notes about this report..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setAdminNotes("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotes}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;




