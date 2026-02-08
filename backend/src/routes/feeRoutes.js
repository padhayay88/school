const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  listFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  listPayments,
  recordPayment,
  listStudentPayments,
  deletePayment,
  deleteFeeStructure,
} = require("../controllers/feeController");

const router = express.Router();

router.get("/structures", requireAuth, listFeeStructures);
router.post("/structures", requireAuth, createFeeStructure);
router.put("/structures/:id", requireAuth, updateFeeStructure);
router.delete("/structures/:id", requireAuth, deleteFeeStructure);
router.get("/payments", requireAuth, listPayments);
router.post("/payments", requireAuth, recordPayment);
router.get("/payments/student/:studentId", requireAuth, listStudentPayments);
router.delete("/payments/:id", requireAuth, deletePayment);

module.exports = router;
