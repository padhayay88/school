const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const { getSummary, getMonthlyFeeCollection } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", requireAuth, getSummary);
router.get("/monthly-fees", requireAuth, getMonthlyFeeCollection);

module.exports = router;
