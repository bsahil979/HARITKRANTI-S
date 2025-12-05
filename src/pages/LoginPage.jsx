"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaSeedling, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    const queryParams = new URLSearchParams(location.search);
    const selectedRole = queryParams.get("role");
    if (selectedRole) {
      setRole(selectedRole);
    }
    // Allow login without role selection - role will be auto-detected from user account

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user, location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send role if it's explicitly selected (farmer/customer)
    // Admin role will be auto-detected from the user's account
    const loginData = { email, password };
    if (role && role !== "admin") {
      loginData.role = role;
    }
    dispatch(login(loginData));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Video - Sunlight through leaves / Farm field at sunrise */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-80 z-0"
        poster="/assets/farm-sunlight.jpg"
      >
        <source src="/assets/farm-sunlight.mp4" type="video/mp4" />
        {/* Fallback to existing video if new video not available */}
        <source src="/haritvideo.mp4" type="video/mp4" />
      </video>
      
      {/* Semi-transparent overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-900/30 backdrop-blur-sm z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 bg-white/80 rounded-2xl shadow-xl p-8 w-96 max-w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <FaSeedling className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            {role ? `Sign in as ${role === "farmer" ? "Farmer" : role === "customer" ? "Customer" : "User"}` : "Welcome Back"}
          </h2>
          
          {!role && (
            <div className="mt-4 mb-4 flex gap-3 justify-center">
              <Link
                to="/login?role=farmer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <FaSeedling />
                Login as Farmer
              </Link>
              <Link
                to="/login?role=customer"
                className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium"
              >
                <FaUser />
                Login as Customer
              </Link>
            </div>
          )}

          <p className="text-sm text-gray-700">
            {!role && (
              <>
                Don't have an account?{" "}
                <Link
                  to="/select-role"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  Register here
                </Link>
              </>
            )}
            {role && role !== "admin" && (
              <>
                Or{" "}
                <Link
                  to={`/register?role=${role}`}
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  create a new account
                </Link>
              </>
            )}
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-10 pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-lg" />
                  ) : (
                    <FaEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
