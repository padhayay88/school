const jwt = require("jsonwebtoken");

// SIMPLE MODE: No database needed
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";

const requireAuth = async (req, res, next) => {
  // Check Authorization header first, then cookies
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.accessToken;
  }
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.owner = { id: payload.ownerId, email: payload.email };
    next();
  } catch (error) {
    // This could be an expired token
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { requireAuth };
