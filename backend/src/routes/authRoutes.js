const express = require("express");
const { loginOwner, logoutOwner, refreshToken, getMe } = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/login", loginOwner);
router.post("/logout", logoutOwner);
router.post("/refresh", refreshToken);
router.get("/me", requireAuth, getMe);

module.exports = router;
