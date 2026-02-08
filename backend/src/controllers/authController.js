const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

const buildCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.COOKIE_SECURE === "true",
  path: "/",
});

const generateAccessToken = (owner) =>
  jwt.sign(
    { ownerId: owner._id, email: owner.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );

const generateRefreshToken = (owner) =>
  jwt.sign(
    { ownerId: owner._id, tokenVersion: owner.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );

const loginOwner = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, owner.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(owner);
    const refreshToken = generateRefreshToken(owner);

    res.cookie("accessToken", accessToken, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshToken, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      owner: { id: owner._id, email: owner.email },
      accessToken,
      refreshToken,
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

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const owner = await Owner.findById(payload.ownerId);

    if (!owner || owner.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = generateAccessToken(owner);

    res.cookie("accessToken", accessToken, {
      ...buildCookieOptions(),
      maxAge: 1000 * 60 * 15,
    });

    return res.json({
      owner: { id: owner._id, email: owner.email },
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
