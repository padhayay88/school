const jwt = require("jsonwebtoken");

// Hardcoded credentials for simple mode
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@school.local";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "ChangeMe123!";
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "simple-refresh-key-12345";

const generateAccessToken = (owner) =>
  jwt.sign({ ownerId: owner.id, email: owner.email }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (owner) =>
  jwt.sign({ ownerId: owner.id, tokenVersion: 1 }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
};

// CORS headers for all responses
const setCorsHeaders = (res, origin) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
  ];
  
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

// Parse cookies from request
const parseCookies = (req) => {
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
};

// Auth middleware helper
const requireAuth = (req) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    const cookies = parseCookies(req);
    token = cookies.accessToken;
  }
  
  if (!token) return null;
  
  const payload = verifyAccessToken(token);
  if (!payload) return null;
  
  return { id: payload.ownerId, email: payload.email };
};

module.exports = {
  OWNER_EMAIL,
  OWNER_PASSWORD,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setCorsHeaders,
  parseCookies,
  requireAuth,
};
