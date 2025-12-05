"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../../redux/slices/messageSlice";
import Loader from "../../components/Loader";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaComments,
  FaUser,
  FaExclamationTriangle,
} from "react-icons/fa";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, loading } = useSelector((state) => state.messages);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  useEffect(() => {
    if (conversations) {
      let filtered = [...conversations];

      if (searchTerm) {
        filtered = filtered.filter(
          (conv) =>
            conv.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.lastMessage?.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredConversations(filtered);
    }
  }, [conversations, searchTerm]);

  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowDetails(conversation.user._id);
  };

  const handleDeleteMessage = (conversation) => {
    setSelectedConversation(conversation);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete messages
    console.log("Deleting conversation:", selectedConversation);
    setShowDeleteModal(false);
    setSelectedConversation(null);
    // dispatch(deleteConversation(selectedConversation.user._id));
  };

  if (loading && conversations.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Message Moderation</h1>
        <div className="text-sm text-gray-600">
          Total Conversations: {filteredConversations.length}
        </div>
      </div>

      {/* Search */}
      <div className="glass p-6 rounded-xl mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name, email, or message content..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversations List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">All Conversations</h2>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.user._id}
                className={`glass p-4 rounded-xl cursor-pointer transition-all ${
                  showDetails === conversation.user._id
                    ? "ring-2 ring-green-500 bg-green-50"
                    : "hover:shadow-lg"
                }`}
                onClick={() => handleViewConversation(conversation)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUser className="text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {conversation.user?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.user?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <div className="mt-3 text-sm text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessage
                      ? new Date(conversation.lastMessage.createdAt).toLocaleDateString()
                      : "No messages"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewConversation(conversation);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                      title="View Messages"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMessage(conversation);
                      }}
                      className="text-red-600 hover:text-red-900 text-sm"
                      title="Delete Conversation"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation Details */}
          {selectedConversation && showDetails && (
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Conversation Details</h2>
                <button
                  onClick={() => {
                    setShowDetails(null);
                    setSelectedConversation(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">User Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedConversation.user?.name || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedConversation.user?.email || "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {selectedConversation.user?.role || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Unread Messages:</span>{" "}
                    {selectedConversation.unreadCount || 0}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Last Message</h3>
                {selectedConversation.lastMessage ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">
                      {selectedConversation.lastMessage.content}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(
                        selectedConversation.lastMessage.createdAt
                      ).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No messages yet</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      // Navigate to full conversation view
                      window.open(`/messages/${selectedConversation.user._id}`, "_blank");
                    }}
                    className="btn btn-outline flex-1"
                  >
                    View Full Conversation
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedConversation)}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-yellow-600 mr-2 mt-1" />
                  <div className="text-sm text-yellow-800">
                    <strong>Admin Note:</strong> Use this moderation panel to monitor
                    conversations. Only delete conversations if they violate platform
                    policies.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaComments className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Conversations Found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "No conversations match your search criteria."
              : "There are no conversations in the system yet."}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete all messages in the conversation with{" "}
              <span className="font-medium">
                {selectedConversation.user?.name || "this user"}
              </span>
              ? This action cannot be undone.
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
                Delete Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;




