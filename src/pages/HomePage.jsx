// src/pages/HomePage.jsx
"use client";

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSeedling, FaCloudSun, FaStore, FaLeaf, FaBookOpen } from "react-icons/fa";
import { useI18n } from "../context/I18nProvider";

const HomePage = () => {
  const dispatch = useDispatch();
  const { t } = useI18n();

  // use optional chaining / default empty arrays to avoid undefined crashes
  const { products = [], loading: productLoading = false } = useSelector(
    (state) => state.products || {}
  );
  const { farmers = [], loading: farmerLoading = false } = useSelector(
    (state) => state.farmers || {}
  );
  const { categories = [], loading: categoryLoading = false } = useSelector(
    (state) => state.categories || {}
  );

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  const Section = ({ children, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
      <motion.section
        ref={ref}
        className={className}
        initial={{ opacity: 0, x: -50, y: 50 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -50, y: 50 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.section>
    );
  };

  const AnimatedLink = ({ to, className, children, whileHover }) => (
    <motion.div whileHover={whileHover} className="inline-block">
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );

  const AnimatedDiv = ({ children, whileHover, className }) => (
    <motion.div whileHover={whileHover} className={className}>
      {children}
    </motion.div>
  );

  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl shadow-lg transform scale-105"
          autoPlay
          muted
          loop
          playsInline
          poster="/haritvideo.mp4"
        >
          <source src="/haritvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40 z-10 pointer-events-none" aria-hidden="true" />
        <div className="relative z-20 w-full">
          <div className="max-w-2xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-white/80 backdrop-blur text-emerald-800 text-xs font-semibold rounded-full px-4 py-2 mb-6 shadow-md border border-emerald-200"
            >
              <span className="uppercase tracking-wider">
                {t("announcement")}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-white"
            >
              {t("heroTitleLine1")} &
              <br className="hidden md:block" /> {t("heroTitleLine2")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-base md:text-lg text-gray-100 mb-10"
            >
              {t("heroSubtitle1")}
              <br className="hidden md:block" />
              {t("heroSubtitle2")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <AnimatedLink
                to="/products"
                className="btn btn-primary px-8 py-3 text-lg rounded-xl font-bold shadow-lg"
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}
              >
                {t("shopNow")}
              </AnimatedLink>
              <AnimatedLink
                to="/farmers"
                className="btn btn-outline px-8 py-3 text-lg rounded-xl font-bold shadow-lg text-white border-white hover:bg-white hover:text-emerald-700"
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}
              >
                {t("meetFarmers")}
              </AnimatedLink>
            </motion.div>
          </div>
        </div>
      </section>

      <Section className="py-24 bg-gradient-to-b from-slate-50 to-white mb-16 rounded-t-3xl">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-16"
          >
            {t("whyChoose")}
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {[
              { to: "/crop-recommendation", icon: <FaSeedling className="text-emerald-600 text-3xl" />, title: t("cropRecommendation"), desc: t("cropRecommendationDesc") },
              { to: "/weather-forecast", icon: <FaCloudSun className="text-emerald-600 text-3xl" />, title: t("weatherForecasting"), desc: t("weatherForecastingDesc") },
              { to: "/marketplace", icon: <FaStore className="text-emerald-600 text-3xl" />, title: t("directMarketplace"), desc: t("directMarketplaceDesc") },
              { to: "/guidance", icon: <FaBookOpen className="text-emerald-600 text-3xl" />, title: t("guidance"), desc: t("guidanceDesc") },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
              >
                <AnimatedLink to={item.to} className="glass p-6 rounded-2xl text-center shadow-lg block h-full" whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}>
                  <AnimatedDiv className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md" whileHover={{ scale: 1.1 }}>
                    {item.icon}
                  </AnimatedDiv>
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-gray-600">
                    {item.desc}
                  </p>
                </AnimatedLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800"
            >
              {t("featuredProducts")}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/products"
                className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
              >
                {t("viewAllProducts")}
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : (() => {
              const filteredProducts = (products ?? []).filter(product =>
                product.category?.name?.toLowerCase() === 'fruits' ||
                product.category?.name?.toLowerCase() === 'vegetables'
              );
              return filteredProducts.length > 0 ? (
                filteredProducts
                  .slice(0, 4)
                  .map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t("noFeatured")}</h3>
                  <p className="text-gray-500 mb-6">{t("checkBack")}</p>
                  <Link
                    to="/products"
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    {t("browseAll")}
                  </Link>
                </div>
              );
            })()}
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-gradient-to-b from-white to-gray-50 mb-16 rounded-t-3xl">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Fresh Produce Direct from Partnered Farmers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated categories of farm-fresh products, sourced directly from verified local farmers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {[
              { to: "/products?category=vegetables", emoji: "🥬", title: "Vegetables", desc: "Leafy greens, tomatoes, onions", bg: "from-emerald-100 to-green-100" },
              { to: "/products?category=fruits", emoji: "🍎", title: "Fruits", desc: "Mangoes, bananas, papayas", bg: "from-orange-100 to-red-100" },
              { to: "/products?category=grains", emoji: "🌾", title: "Grains & Cereals", desc: "Rice, wheat, jowar, bajra", bg: "from-yellow-100 to-amber-100" },
              { to: "/products?category=pulses", emoji: "🧅", title: "Pulses & Legumes", desc: "Moong, toor, chana, masoor", bg: "from-purple-100 to-indigo-100" },
            ].map((category, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                }}
              >
                <AnimatedLink
                  to={category.to}
                  className="group glass p-8 rounded-3xl text-center shadow-lg border border-emerald-100 hover:border-emerald-200 block h-full"
                  whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
                >
                  <AnimatedDiv className={`w-20 h-20 bg-gradient-to-br ${category.bg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-md`} whileHover={{ scale: 1.1 }}>
                    <span className="text-4xl">{category.emoji}</span>
                  </AnimatedDiv>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {category.desc}
                  </p>
                  <p className="text-xs text-emerald-600 mb-6 font-medium">
                    Sourced from verified local farmers
                  </p>
                  <motion.button
                    className="btn btn-primary px-6 py-3 text-sm font-semibold rounded-xl shadow-md"
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}
                  >
                    Shop Now
                  </motion.button>
                </AnimatedLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800"
            >
              {t("ourFarmers")}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/farmers"
                className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
              >
                {t("viewAllFarmers")}
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : (farmers ?? []).length > 0 ? (
              (farmers ?? [])
                .slice(0, 3)
                .map((farmer, index) => (
                  <motion.div
                    key={farmer._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
                  >
                    <FarmerCard farmer={farmer} />
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">{t("noFarmersYet")}</h3>
                <p className="text-gray-500 mb-6">{t("connectingFarmers")}</p>
                <Link
                  to="/farmers"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t("checkBackLater")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="py-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-t-3xl">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-8"
          >
            {t("ctaReady")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-12 max-w-2xl mx-auto"
          >
            {t("ctaText")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <AnimatedLink
              to="/register"
              className="btn bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}
            >
              {t("signUpNow")}
            </AnimatedLink>
            <AnimatedLink
              to="/about"
              className="btn border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.2)" }}
            >
              {t("learnMore")}
            </AnimatedLink>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
