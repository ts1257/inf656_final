const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const router = express.Router();

router.use(auth);

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("code").notEmpty().withMessage("Code is required")
  ],
  createCourse
);

router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
