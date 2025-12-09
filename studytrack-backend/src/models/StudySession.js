const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 15
    },
    notes: {
      type: String,
      maxlength: 500
    },
    status: {
      type: String,
      enum: ["planned", "completed", "skipped"],
      default: "planned"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudySession", studySessionSchema);
