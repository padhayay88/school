const jwt = require("jsonwebtoken");

// SIMPLE MODE: No database needed - hardcoded credentials for testing
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@school.local";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "ChangeMe123!";
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "simple-refresh-key-12345";

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.COOKIE_SECURE === "true",
  path: "/",
});

const generateAccessToken = (owner) =>
  jwt.sign(
    { ownerId: owner.id, email: owner.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (owner) =>
  jwt.sign(
    { ownerId: owner.id, tokenVersion: 1 },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

const loginOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Simple credential check - no database needed
    if (email !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const owner = { id: "owner-1", email: OWNER_EMAIL };
    const accessToken = generateAccessToken(owner);
    const refreshTokenValue = generateRefreshToken(owner);

    res.cookie("accessToken", accessToken, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshTokenValue, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      owner: { id: owner.id, email: owner.email },
      accessToken,
      refreshToken: refreshTokenValue,
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // Check body first, then cookies for refresh token
    let token = req.body.refreshToken || req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, JWT_REFRESH_SECRET);
    const owner = { id: payload.ownerId, email: OWNER_EMAIL };
    const accessToken = generateAccessToken(owner);

    res.cookie("accessToken", accessToken, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 15,
    });

    return res.json({
      owner: { id: owner.id, email: owner.email },
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const logoutOwner = (req, res) => {
  res.cookie("accessToken", "", { ...buildCookieOptions(), maxAge: 0 });
  res.cookie("refreshToken", "", { ...buildCookieOptions(), maxAge: 0 });
  res.json({ message: "Logged out" });
};

const getMe = async (req, res, next) => {
  try {
    // This will be populated by the requireAuth middleware
    if (!req.owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ owner: req.owner });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginOwner,
  refreshToken,
  logoutOwner,
  getMe,
};
