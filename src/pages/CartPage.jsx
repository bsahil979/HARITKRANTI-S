"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
  clearCart,
} from "../redux/slices/cartSlice";
import { FaArrowLeft, FaLeaf, FaTrash, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { placeholder } from "../assets";
import { useI18n } from "../context/I18nProvider";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useI18n();

  const { cartItems, farmerId, farmerName } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <FaShoppingCart className="text-gray-400 text-6xl mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
          </p>
          <Link
            to="/marketplace"
            className="btn btn-primary inline-flex items-center"
          >
            <FaLeaf className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-500 hover:text-green-700 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="text-gray-600">
              {calculateItemCount()} item{calculateItemCount() !== 1 ? 's' : ''} in your cart
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500 hover:text-red-700 flex items-center"
        >
          <FaTrash className="mr-2" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <FaLeaf className="text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold">Ordering from: {farmerName}</h2>
                <p className="text-gray-600 text-sm">All items from the same farmer</p>
              </div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={placeholder}
                        alt="placeholder"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-green-600 font-bold text-lg">
                      ₨{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mr-6">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <FaMinus className="text-sm" />
                    </button>
                    <span className="mx-4 font-semibold text-lg min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <FaPlus className="text-sm" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right mr-4">
                    <p className="font-bold text-lg">
                      ₨{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({calculateItemCount()} items)</span>
                <span>₨{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₨{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Please login to proceed with checkout
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary w-full"
                >
                  Login to Checkout
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="btn btn-primary w-full"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/marketplace"
                  className="btn btn-outline w-full"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <FaLeaf className="mr-2" />
                <span className="text-sm font-medium">Direct from Farm</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Fresh products directly from {farmerName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
