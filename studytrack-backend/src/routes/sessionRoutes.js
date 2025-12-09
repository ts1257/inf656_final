const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession
} = require("../controllers/sessionController");

const router = express.Router();

router.use(auth);

router.get("/", getSessions);
router.get("/:id", getSessionById);

router.post(
  "/",
  [
    body("date").notEmpty().withMessage("Date is required"),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("durationMinutes")
      .isInt({ min: 15 })
      .withMessage("Duration must be at least 15 minutes")
  ],
  createSession
);

router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
