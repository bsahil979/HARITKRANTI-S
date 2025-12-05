"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUnreadCount, getUserNotifications, markAsRead } from "../redux/slices/notificationSlice";
import {
  FaTachometerAlt,
  FaUsers,
  FaShoppingCart,
  FaList,
  FaBox,
  FaChartBar,
  FaCog,
  FaBars,
  FaTimes,
  FaComments,
  FaExclamationCircle,
  FaStore,
  FaBell,
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { unreadCount, notifications } = useSelector((state) => state.notifications || {});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    dispatch(getUnreadCount());
    dispatch(getUserNotifications());
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(getUnreadCount());
      dispatch(getUserNotifications());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  const menuItems = [
    { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/purchase", icon: FaShoppingCart, label: "Purchase" },
    { path: "/admin/inventory", icon: FaBox, label: "Inventory" },
    { path: "/admin/marketplace", icon: FaStore, label: "My Marketplace" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders" },
    { path: "/admin/categories", icon: FaList, label: "Categories" },
    { path: "/admin/messages", icon: FaComments, label: "Messages" },
    { path: "/admin/reports", icon: FaExclamationCircle, label: "Reports" },
    { path: "/admin/analytics", icon: FaChartBar, label: "Analytics" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-emerald-600">Admin Panel</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-gray-600 hover:text-gray-900 relative"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {notifications && notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (notif.link) navigate(notif.link);
                          if (!notif.isRead) dispatch(markAsRead(notif._id));
                          setShowNotifications(false);
                        }}
                        className={`p-3 cursor-pointer hover:bg-gray-50 ${!notif.isRead ? "bg-blue-50" : ""}`}
                      >
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Desktop Header with Notifications */}
      <div className="hidden lg:block fixed top-0 right-0 left-64 bg-white shadow-sm z-40 px-6 py-4 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-600 hover:text-gray-900 relative"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-500">{unreadCount} unread</span>
                )}
              </div>
              <div className="divide-y divide-gray-200">
                {notifications && notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => {
                        if (notif.link) navigate(notif.link);
                        if (!notif.isRead) dispatch(markAsRead(notif._id));
                        setShowNotifications(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-gray-50 ${!notif.isRead ? "bg-blue-50" : ""}`}
                    >
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                )}
              </div>
              {notifications && notifications.length > 10 && (
                <div className="p-3 border-t border-gray-200 text-center">
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 hidden lg:block">
              <h1 className="text-2xl font-bold text-emerald-600">HaritKranti</h1>
              <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 hidden lg:block">
              <p className="text-xs text-gray-500 text-center">
                © 2024 HaritKranti
              </p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="pt-16 lg:pt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

