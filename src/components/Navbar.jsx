"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useI18n } from "../context/I18nProvider";
import {
  FaSeedling,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { t, lang, setLang } = useI18n();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Change background after scrolling 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangOpen && !event.target.closest('.language-dropdown')) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleLang = () => {
    setIsLangOpen(!isLangOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className={`${isHomePage ? (isScrolled ? 'bg-white/10 backdrop-blur-md shadow-md fixed top-0 z-50 w-full rounded-b-3xl' : 'bg-transparent backdrop-blur-md fixed top-0 z-50 w-full rounded-b-3xl') : 'bg-white/10 backdrop-blur-md shadow-md sticky top-0 z-50 rounded-b-3xl'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaSeedling className={`${isHomePage && !isScrolled ? 'text-emerald-400' : 'text-emerald-600'} text-2xl`} />
            <span className={`text-xl font-bold ${isHomePage && !isScrolled ? 'text-white' : 'text-emerald-800'}`}>HaritKranti</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
            >
              {t("home")}
            </Link>
            <Link
              to="/marketplace"
              className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
            >
              Direct Marketplace
            </Link>
            <Link
              to="/farmers"
              className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
            >
              {t("farmers")}
            </Link>
            <Link
              to="/about"
              className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
            >
              {t("about")}
            </Link>

            <div className="relative language-dropdown">
              <button
                onClick={toggleLang}
                className={`px-3 py-1.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center space-x-1 ${isHomePage && !isScrolled ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30' : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'}`}
                aria-label="Select language"
              >
                <span>
                  {lang === "en" && "English"}
                  {lang === "hi" && "हिंदी"}
                  {lang === "mr" && "मराठी"}
                  {lang === "te" && "తెలుగు"}
                  {lang === "ta" && "தமிழ்"}
                  {lang === "kn" && "ಕನ್ನಡ"}
                  {lang === "gu" && "ગુજરાતી"}
                  {lang === "bn" && "বাংলা"}
                  {lang === "pa" && "ਪੰਜਾਬੀ"}
                  {lang === "or" && "ଓଡ଼ିଆ"}
                </span>
                <span className="text-xs">▼</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white/20 backdrop-blur-lg rounded-md shadow-xl py-1 z-50 border border-white/20 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => { setLang("en"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "en" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLang("hi"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "hi" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    हिंदी
                  </button>
                  <button
                    onClick={() => { setLang("mr"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "mr" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    मराठी
                  </button>
                  <button
                    onClick={() => { setLang("te"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "te" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    తెలుగు
                  </button>
                  <button
                    onClick={() => { setLang("ta"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "ta" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => { setLang("kn"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "kn" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    ಕನ್ನಡ
                  </button>
                  <button
                    onClick={() => { setLang("gu"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "gu" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    ગુજરાતી
                  </button>
                  <button
                    onClick={() => { setLang("bn"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "bn" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => { setLang("pa"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "pa" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    ਪੰਜਾਬੀ
                  </button>
                  <button
                    onClick={() => { setLang("or"); setIsLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-500/20 hover:text-white transition-colors ${lang === "or" ? "bg-emerald-500/30 text-white font-medium" : "text-white"}`}
                  >
                    ଓଡ଼ିଆ
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated && user?.role === "consumer" && (
            <Link to="/cart" className="relative">
                <FaShoppingCart className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} text-xl transition-colors`} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className={`flex items-center space-x-2 ${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors focus:outline-none`}
                >
                  <FaUser className="text-xl" />
                  <span className="font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("adminDashboard")}
                      </Link>
                    )}

                    {user?.role === "farmer" && (
                      <Link
                        to="/farmer/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        {t("farmerDashboard")}
                      </Link>
                    )}

                    {user?.role !== "admin" && (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {t("profile")}
                        </Link>

                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {t("orders")}
                        </Link>
                      </>
                    )}

                    <Link
                      to="/messages"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-500"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {t("messages")}
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>{t("logout")}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`${isHomePage && !isScrolled ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-green-500'} focus:outline-none`}
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 ${isHomePage ? 'bg-black/20 backdrop-blur-md rounded-lg p-4' : ''}`}>
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                onClick={toggleMenu}
              >
                {t("home")}
              </Link>
              <Link
                to="/marketplace"
                className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                onClick={toggleMenu}
              >
                Direct Marketplace
              </Link>
              <Link
                to="/farmers"
                className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                onClick={toggleMenu}
              >
                {t("farmers")}
              </Link>
              <Link
                to="/about"
                className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                onClick={toggleMenu}
              >
                {t("about")}
              </Link>

              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => { setLang(e.target.value); toggleMenu(); }}
                  className={`w-full px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isHomePage ? 'bg-white/20 text-white border-white/30' : 'bg-gray-100 text-gray-700'}`}
                  aria-label="Select language"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="mr">मराठी</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="gu">ગુજરાતી</option>
                  <option value="bn">বাংলা</option>
                  <option value="pa">ਪੰਜਾਬੀ</option>
                  <option value="or">ଓଡ଼ିଆ</option>
                </select>
              </div>

              {isAuthenticated && user?.role === "consumer" && (
                <Link
                  to="/cart"
                  className={`flex items-center space-x-2 ${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-green-500'} transition-colors`}
                  onClick={toggleMenu}
                >
                  <FaShoppingCart />
                  <span>Cart ({cartItems.length})</span>
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === "farmer" && (
                    <Link
                      to="/farmer/dashboard"
                      className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Farmer Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                    onClick={toggleMenu}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/messages"
                    className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                    onClick={toggleMenu}
                  >
                    Messages
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className={`flex items-center space-x-2 ${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-green-500'} transition-colors`}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className={`${isHomePage ? 'text-white hover:text-emerald-300' : 'text-gray-700 hover:text-emerald-600'} transition-colors font-medium`}
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`${isHomePage ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-green-500 text-white hover:bg-green-600'} px-4 py-2 rounded-lg transition-colors text-center`}
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
