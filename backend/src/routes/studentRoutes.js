const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

router.get("/", requireAuth, listStudents);
router.post("/", requireAuth, createStudent);
router.put("/:id", requireAuth, updateStudent);
router.delete("/:id", requireAuth, deleteStudent);

module.exports = router;
