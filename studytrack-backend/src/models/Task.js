const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["assignment", "exam", "project", "quiz"],
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    estimatedTimeHours: {
      type: Number,
      min: 0
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "done"],
      default: "not-started"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
