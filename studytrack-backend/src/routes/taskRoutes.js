const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const router = express.Router();

router.use(auth);

router.get("/", getTasks);
router.get("/:id", getTaskById);

router.post(
  "/",
  [
    body("course").notEmpty().withMessage("Course is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("type").isIn(["assignment", "exam", "project", "quiz"]).withMessage("Invalid type"),
    body("dueDate").notEmpty().withMessage("Due date is required")
  ],
  createTask
);

router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
