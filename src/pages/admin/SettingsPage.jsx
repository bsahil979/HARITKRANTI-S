"use client";

import { useState } from "react";
import { FaSave, FaBell, FaShieldAlt, FaGlobe, FaPalette, FaDatabase } from "react-icons/fa";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "HaritKranti",
    siteDescription: "Smart Agriculture & Farmer Marketplace",
    maintenanceMode: false,
    allowRegistration: true,
    
    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    userNotifications: true,
    productNotifications: true,
    
    // Security Settings
    requireEmailVerification: false,
    minPasswordLength: 6,
    sessionTimeout: 30,
    enable2FA: false,
    
    // Marketplace Settings
    allowDirectMessaging: true,
    requireOrderConfirmation: true,
    maxProductImages: 5,
    defaultCurrency: "INR",
    
    // Display Settings
    itemsPerPage: 12,
    enableDarkMode: false,
    language: "en",
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully!");
    console.log("Settings saved:", settings);
  };

  const tabs = [
    { id: "general", label: "General", icon: FaGlobe },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "marketplace", label: "Marketplace", icon: FaDatabase },
    { id: "display", label: "Display", icon: FaPalette },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FaSave />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="glass rounded-xl overflow-hidden mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-green-500 text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Content */}
      <div className="glass p-6 rounded-xl">
        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleChange("siteDescription", e.target.value)}
                className="form-input w-full"
                rows="3"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maintenance Mode
                </label>
                <p className="text-sm text-gray-500">
                  Enable to temporarily disable the site for maintenance
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allow User Registration
                </label>
                <p className="text-sm text-gray-500">
                  Allow new users to register on the platform
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleChange("allowRegistration", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            {[
              { key: "emailNotifications", label: "Email Notifications", desc: "Send email notifications for important events" },
              { key: "orderNotifications", label: "Order Notifications", desc: "Notify admins about new orders" },
              { key: "userNotifications", label: "User Notifications", desc: "Notify admins about new user registrations" },
              { key: "productNotifications", label: "Product Notifications", desc: "Notify admins about new product listings" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Require Email Verification
                </label>
                <p className="text-sm text-gray-500">
                  Users must verify their email before accessing the platform
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange("requireEmailVerification", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="20"
                value={settings.minPasswordLength}
                onChange={(e) => handleChange("minPasswordLength", parseInt(e.target.value))}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                className="form-input w-full"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-500">
                  Require 2FA for admin accounts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable2FA}
                  onChange={(e) => handleChange("enable2FA", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Marketplace Settings */}
        {activeTab === "marketplace" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Marketplace Settings</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allow Direct Messaging
                </label>
                <p className="text-sm text-gray-500">
                  Allow users to message each other directly
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowDirectMessaging}
                  onChange={(e) => handleChange("allowDirectMessaging", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Require Order Confirmation
                </label>
                <p className="text-sm text-gray-500">
                  Farmers must confirm orders before processing
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireOrderConfirmation}
                  onChange={(e) => handleChange("requireOrderConfirmation", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Product Images
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxProductImages}
                onChange={(e) => handleChange("maxProductImages", parseInt(e.target.value))}
                className="form-input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => handleChange("defaultCurrency", e.target.value)}
                className="form-input w-full"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        )}

        {/* Display Settings */}
        {activeTab === "display" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items Per Page
              </label>
              <input
                type="number"
                min="6"
                max="50"
                value={settings.itemsPerPage}
                onChange={(e) => handleChange("itemsPerPage", parseInt(e.target.value))}
                className="form-input w-full"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enable Dark Mode
                </label>
                <p className="text-sm text-gray-500">
                  Allow users to switch to dark theme
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableDarkMode}
                  onChange={(e) => handleChange("enableDarkMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="form-input w-full"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;




