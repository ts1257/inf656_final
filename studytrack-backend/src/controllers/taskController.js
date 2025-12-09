const { validationResult } = require("express-validator");
const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.courseId) filter.course = req.query.courseId;
    if (req.query.status) filter.status = req.query.status;

    const tasks = await Task.find(filter).populate("course").sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).populate("course");
    if (!task) {
      res.status(404);
      return res.json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ errors: errors.array() });
    }

    const { course, title, type, dueDate, estimatedTimeHours, priority, status } = req.body;

    const task = await Task.create({
      user: req.user._id,
      course,
      title,
      type,
      dueDate,
      estimatedTimeHours,
      priority,
      status
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      res.status(404);
      return res.json({ message: "Task not found" });
    }

    const updates = req.body;
    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      res.status(404);
      return res.json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
