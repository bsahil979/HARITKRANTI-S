import jwt from "jsonwebtoken";
import User from "../models/User.js";


const normalizeRole = (role) => {
  if (role === undefined || role === null) return undefined;
  const normalized = String(role).trim().toLowerCase();
  if (normalized === "customer") return "consumer";
  if (["consumer", "farmer", "admin"].includes(normalized)) return normalized;
  return undefined;
};

// Generate JWT Token
const generateToken = (id) => {
  const envSecret = process.env.JWT_SECRET;
  const envExpire = process.env.JWT_EXPIRE;
  const normalize = (value) => {
    if (!value) return "";
    const trimmed = value.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  };
  const normalizedSecret = normalize(envSecret);
  const invalidMarkers = new Set(["undefined", "null"]);
  const effectiveSecret = invalidMarkers.has(normalizedSecret.toLowerCase()) ? "" : normalizedSecret;
  const jwtSecret = effectiveSecret.length > 0
    ? normalizedSecret
    : "haritkranti_super_secret_jwt_key_2024_secure_token_generation";
  const jwtExpire = envExpire && envExpire.trim().length > 0 ? envExpire : "7d";
  if (!jwtSecret || jwtSecret.length === 0) {
    console.error("JWT secret resolution failed: empty secret after normalization. Falling back failed.");
    throw new Error("JWT secret not configured");
  }
  console.log(`[auth] Signing token with secret length=${jwtSecret.length}, expiresIn=${jwtExpire}`);
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Please ensure you're sending JSON data with Content-Type: application/json header.",
      });
    }

    const { name, email, password, role, phone, address } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, and password are required.",
      });
    }

    const normalizedRole = normalizeRole(role) || "consumer";

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Build user data object with all provided fields
    const userData = {
      name,
      email,
      password,
      role: normalizedRole,
      phone,
    };
    
    // Add address if provided
    if (address) {
      userData.address = address;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing. Please ensure you're sending JSON data with Content-Type: application/json header.",
      });
    }

    const { email, password, role } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: email and password are required.",
      });
    }

    const normalizedRole = normalizeRole(role);

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check role if specified
    if (normalizedRole && user.role !== normalizedRole) {
      return res.status(401).json({
        success: false,
        message: "Invalid role",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
