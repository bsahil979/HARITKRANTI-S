import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      const envSecret = process.env.JWT_SECRET;
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
      if (!jwtSecret || jwtSecret.length === 0) {
        console.error("JWT secret resolution failed in middleware: empty secret after normalization.");
        throw new Error("JWT secret not configured");
      }
      console.log(`[auth] Verifying token with secret length=${jwtSecret.length}`);
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// Optional authentication - sets req.user if token is provided, but doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // No token provided - continue without setting req.user (public access)
      return next();
    }

    try {
      const envSecret = process.env.JWT_SECRET;
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
      
      if (jwtSecret && jwtSecret.length > 0) {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decoded.id);
      }
      // If token is invalid, just continue without req.user (don't fail)
      next();
    } catch (error) {
      // Invalid token - continue without req.user (don't fail for optional auth)
      console.log("Optional auth: Invalid token, continuing as public:", error.message);
      next();
    }
  } catch (error) {
    // Any error - continue without req.user
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
