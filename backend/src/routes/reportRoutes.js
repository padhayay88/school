const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  studentListReport,
  feeCollectionReport,
  pendingDuesReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/students", requireAuth, studentListReport);
router.get("/fees", requireAuth, feeCollectionReport);
router.get("/pending-dues", requireAuth, pendingDuesReport);

module.exports = router;
