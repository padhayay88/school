const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");
const {
  listTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

router.get("/", requireAuth, listTeachers);
router.post("/", requireAuth, createTeacher);
router.put("/:id", requireAuth, updateTeacher);
router.delete("/:id", requireAuth, deleteTeacher);

module.exports = router;
