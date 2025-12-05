import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../context/I18nProvider";
import {
  FaSeedling,
  FaUsers,
  FaCloudSun,
  FaStore,
  FaCheck,
  FaChartLine,
  FaHandshake,
  FaAward,
  FaLeaf,
} from "react-icons/fa";
const teamMembers = [
  {
    id: 1,
    name: "Sahil Patil",
    role: "Co-Founder & CEO",
  },
  {
    id: 2,
    name: "Sahil Belchada",
    role: "Co-Founder & CTO",
  },
  {
    id: 3,
    name: "Samar Prakash",
    role: "Co-Founder & Lead Developer",
  },
];

const stats = [
  { id: 1, value: 1000, suffix: "+", label: "Active Farmers", icon: FaUsers },
  { id: 2, value: 5000, suffix: "+", label: "Happy Customers", icon: FaHandshake },
  { id: 3, value: 50, suffix: "+", label: "Product Categories", icon: FaStore },
  { id: 4, value: 95, suffix: "%", label: "Satisfaction Rate", icon: FaAward },
];

const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const AboutPage = () => {
  const { t } = useI18n();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
        style={{ y }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 20, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Grid Pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          className="relative z-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
              className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full px-4 py-2 mb-6 shadow-lg border border-green-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <span className="uppercase tracking-wider">{t("ourStory")}</span>
            </motion.div>
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t("aboutHarit")}
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {t("aboutSubtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                to="/register"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {t("signUpNow")}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-green-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Statistics Section */}
        <motion.section
          className="py-20 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <Icon className="text-white text-2xl" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="py-24 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-white to-green-50 backdrop-blur-md shadow-2xl p-10 md:p-16 rounded-3xl max-w-6xl mx-auto border border-green-100"
            >
              <div className="flex flex-col md:flex-row items-center gap-12">
                <motion.div
                  className="md:w-1/2 text-center md:text-left"
                  variants={itemVariants}
                >
                  <motion.h2
                    className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 leading-tight"
                    variants={itemVariants}
                  >
                    {t("ourMission")}
                  </motion.h2>
                  <motion.p
                    className="text-gray-700 text-lg mb-4 leading-relaxed"
                    variants={itemVariants}
                  >
                    {t("missionP1")}
                  </motion.p>
                  <motion.p
                    className="text-gray-700 text-lg leading-relaxed"
                    variants={itemVariants}
                  >
                    {t("missionP2")}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="md:w-1/2 flex justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                      <FaSeedling className="text-white text-9xl" />
                    </div>
                    <motion.div
                      className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-80"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {t("howItWorks")}
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Discover how we're revolutionizing agriculture through technology and innovation
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaSeedling,
                title: t("smartGuidance"),
                description: t("smartGuidanceDesc"),
                color: "from-green-400 to-emerald-500",
                delay: 0,
              },
              {
                icon: FaCloudSun,
                title: t("weatherAlerts"),
                description: t("weatherAlertsDesc"),
                color: "from-blue-400 to-cyan-500",
                delay: 0.1,
              },
              {
                icon: FaStore,
                title: t("marketplace"),
                description: t("marketplaceDesc"),
                color: "from-orange-400 to-red-500",
                delay: 0.2,
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ delay: feature.delay }}
                >
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="text-white text-4xl" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          className="mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {t("benefits")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: t("forConsumers"),
                benefits: [
                  t("consB1"),
                  t("consB2"),
                  t("consB3"),
                  t("consB4"),
                  t("consB5"),
                ],
                gradient: "from-green-500 to-emerald-500",
              },
              {
                title: t("forFarmers"),
                benefits: [
                  t("farmB1"),
                  t("farmB2"),
                  t("farmB3"),
                  t("farmB4"),
                  t("farmB5"),
                ],
                gradient: "from-blue-500 to-cyan-500",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <h3
                  className={`text-2xl font-bold mb-6 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                >
                  {card.title}
                </h3>
                <ul className="space-y-4">
                  {card.benefits.map((benefit, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <motion.div
                        className={`flex-shrink-0 w-6 h-6 bg-gradient-to-br ${card.gradient} rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <FaCheck className="text-white text-xs" />
                      </motion.div>
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="mb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {t("meetTeam")}
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 text-xl mb-16 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {t("passionateTeam")}
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="relative mb-6"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-200 shadow-lg group-hover:border-green-400 transition-colors duration-300 flex items-center justify-center">
                    <FaUsers className="text-white text-5xl" />
                  </div>
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaLeaf className="text-white text-sm" />
                  </motion.div>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium text-center mb-4">{member.role}</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaAward
                      key={star}
                      className="text-yellow-400 text-sm"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="text-center mb-16 py-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {t("joinCommunity")}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            variants={itemVariants}
          >
            {t("joinCommunityDesc")}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("signUpNow")}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="inline-block bg-white text-green-600 border-2 border-green-500 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-green-50 transition-all duration-300"
              >
                {t("browseProductsCta")}
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
