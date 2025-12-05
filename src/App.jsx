"use client";

import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import FarmerRoute from "./components/FarmerRoute";
import ConsumerRoute from "./components/ConsumerRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FarmersPage from "./pages/FarmersPage";
import FarmerDetailPage from "./pages/FarmerDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WeatherForecastPage from "./pages/WeatherForecastPage";
import MarketplacePage from "./pages/MarketplacePage";
import CartPage from "./pages/CartPage";
import CropRecommendationPage from "./pages/CropRecommendationPage";
import CropRecommendationHistoryPage from "./pages/CropRecommendationHistoryPage";
import GuidancePage from "./pages/GuidancePage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected Pages
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import ConversationPage from "./pages/ConversationPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import CheckoutPage from "./pages/CheckoutPage";

// Farmer Pages
import FarmerDashboardPage from "./pages/farmer/DashboardPage";
import FarmerProductsPage from "./pages/farmer/ProductsPage";
import FarmerAddProductPage from "./pages/farmer/AddProductPage";
import FarmerEditProductPage from "./pages/farmer/EditProductPage";
import FarmerOrdersPage from "./pages/farmer/OrdersPage";
import FarmerProfilePage from "./pages/farmer/ProfilePage";

// Admin Pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminCategoriesPage from "./pages/admin/CategoriesPage";
import AdminOrdersPage from "./pages/admin/OrdersPage";
import AdminProductsPage from "./pages/admin/ProductsPage";
import AdminListingsPage from "./pages/admin/ListingsPage";
import AdminPurchasePage from "./pages/admin/PurchasePage";
import AdminInventoryPage from "./pages/admin/InventoryPage";
import AdminMarketplacePage from "./pages/admin/AdminMarketplacePage";
import AdminMessagesPage from "./pages/admin/MessagesPage";
import AdminReportsPage from "./pages/admin/ReportsPage";
import AdminAnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="select-role" element={<RoleSelectionPage />} />
          <Route path="weather-forecast" element={<WeatherForecastPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="crop-recommendation" element={<CropRecommendationPage />} />
          <Route path="guidance" element={<GuidancePage />} />
          <Route path="farmers" element={<FarmersPage />} />
          <Route path="farmers/:id" element={<FarmerDetailPage />} />
          <Route path="products" element={<Navigate to="/marketplace" replace />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="messages/:userId" element={<ConversationPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="crop-recommendation/history" element={<CropRecommendationHistoryPage />} />
          </Route>

          {/* Consumer Routes */}
          <Route element={<ConsumerRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          {/* Farmer Routes */}
          <Route element={<FarmerRoute />}>
            <Route path="farmer/dashboard" element={<FarmerDashboardPage />} />
            <Route path="farmer/products" element={<FarmerProductsPage />} />
            <Route
              path="farmer/products/add"
              element={<FarmerAddProductPage />}
            />
            <Route
              path="farmer/products/edit/:id"
              element={<FarmerEditProductPage />}
            />
            <Route path="farmer/orders" element={<FarmerOrdersPage />} />
            <Route path="farmer/profile" element={<FarmerProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/products" element={<AdminProductsPage />} />
              <Route path="admin/listings" element={<AdminListingsPage />} />
              <Route path="admin/purchase" element={<AdminPurchasePage />} />
              <Route path="admin/inventory" element={<AdminInventoryPage />} />
              <Route path="admin/marketplace" element={<AdminMarketplacePage />} />
              <Route path="admin/categories" element={<AdminCategoriesPage />} />
              <Route path="admin/orders" element={<AdminOrdersPage />} />
              <Route path="admin/messages" element={<AdminMessagesPage />} />
              <Route path="admin/reports" element={<AdminReportsPage />} />
              <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
