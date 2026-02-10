const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";

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

const requireAuth = (req) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = parseCookies(req).accessToken;
  }
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { id: payload.ownerId, email: payload.email };
  } catch {
    return null;
  }
};

module.exports = { setCorsHeaders, parseCookies, requireAuth };
