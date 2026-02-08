const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const owner = await Owner.findById(payload.ownerId).select("-passwordHash");
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.owner = { id: owner._id, email: owner.email };
    next();
  } catch (error) {
    // This could be an expired token
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { requireAuth };
