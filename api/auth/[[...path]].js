const jwt = require("jsonwebtoken");

// Config
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@school.local";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "ChangeMe123!";
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "simple-refresh-key-12345";

// Helpers
const setCorsHeaders = (res, origin) => {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

const parseCookies = (req) => {
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value || "");
    });
  }
  return cookies;
};

const generateAccessToken = (owner) =>
  jwt.sign({ ownerId: owner.id, email: owner.email }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (owner) =>
  jwt.sign({ ownerId: owner.id, tokenVersion: 1 }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

const verifyToken = (token, secret) => {
  try { return jwt.verify(token, secret); } catch { return null; }
};

const requireAuth = (req) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = parseCookies(req).accessToken;
  }
  if (!token) return null;
  const payload = verifyToken(token, JWT_SECRET);
  return payload ? { id: payload.ownerId, email: payload.email } : null;
};

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = req.url.split("?")[0];
  const path = url.replace("/api/auth", "").replace(/^\//, "") || "root";

  try {
    // POST /api/auth/login
    if (path === "login" && req.method === "POST") {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      if (email !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const owner = { id: "owner-1", email: OWNER_EMAIL };
      const accessToken = generateAccessToken(owner);
      const refreshToken = generateRefreshToken(owner);
      const cookieOpts = "Path=/; HttpOnly; SameSite=Lax";
      res.setHeader("Set-Cookie", [
        `accessToken=${accessToken}; Max-Age=900; ${cookieOpts}`,
        `refreshToken=${refreshToken}; Max-Age=604800; ${cookieOpts}`,
      ]);
      return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken, refreshToken });
    }

    // POST /api/auth/logout
    if (path === "logout") {
      res.setHeader("Set-Cookie", [
        "accessToken=; Path=/; HttpOnly; Max-Age=0",
        "refreshToken=; Path=/; HttpOnly; Max-Age=0",
      ]);
      return res.status(200).json({ message: "Logged out" });
    }

    // POST /api/auth/refresh
    if (path === "refresh" && req.method === "POST") {
      const token = (req.body && req.body.refreshToken) || parseCookies(req).refreshToken;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      const payload = verifyToken(token, JWT_REFRESH_SECRET);
      if (!payload) return res.status(401).json({ message: "Unauthorized" });
      const owner = { id: payload.ownerId, email: OWNER_EMAIL };
      const accessToken = generateAccessToken(owner);
      res.setHeader("Set-Cookie", `accessToken=${accessToken}; Max-Age=900; Path=/; HttpOnly; SameSite=Lax`);
      return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken });
    }

    // GET /api/auth/me
    if (path === "me" && req.method === "GET") {
      const owner = requireAuth(req);
      if (!owner) return res.status(401).json({ message: "Unauthorized" });
      return res.status(200).json({ owner });
    }

    return res.status(404).json({ message: "Not found" });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Export helpers for other files
module.exports.requireAuth = requireAuth;
module.exports.setCorsHeaders = setCorsHeaders;
