"use client";

import { Link } from "react-router-dom";
import { FaUser, FaSeedling } from "react-icons/fa";

const RoleSelectionPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Video - Close-up of crops swaying / Green meadow with gentle breeze */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80 z-0"
        poster="/assets/farm-meadow.jpg"
      >
        <source src="/assets/farm-meadow.mp4" type="video/mp4" />
        {/* Fallback to existing video if new video not available */}
        <source src="/haritvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Semi-transparent overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-900/30 backdrop-blur-sm z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 bg-white/80 rounded-2xl shadow-xl p-8 w-96 max-w-full text-center">
        <div className="flex justify-center mb-4">
          <FaSeedling className="text-green-600 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Select Your Role
        </h2>
        <p className="text-gray-700 mb-6">
          Choose to login or register as:
        </p>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            to="/login?role=farmer"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaSeedling className="mr-3 text-xl" />
            Login as Farmer
          </Link>
          <Link
            to="/login?role=customer"
            className="group relative w-full flex justify-center py-3 px-4 border border-green-600 text-lg font-medium rounded-md text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FaUser className="mr-3 text-xl" />
            Login as Customer
          </Link>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-700 mb-2">
            Admin? Login directly with your credentials
          </p>
          <Link
            to="/login"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Login here (Admin, Farmer, or Customer)
          </Link>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700 mb-2">
            New user? Register as:
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              to="/register?role=farmer"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Register as Farmer
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              to="/register?role=customer"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Register as Customer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
