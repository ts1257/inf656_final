const { validationResult } = require("express-validator");
const StudySession = require("../models/StudySession");

const getSessions = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.courseId) filter.course = req.query.courseId;
    if (req.query.taskId) filter.task = req.query.taskId;
    if (req.query.status) filter.status = req.query.status;

    const sessions = await StudySession.find(filter)
      .populate("course")
      .populate("task")
      .sort({ date: -1 });

    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate("course")
      .populate("task");

    if (!session) {
      res.status(404);
      return res.json({ message: "Study session not found" });
    }

    res.json(session);
  } catch (err) {
    next(err);
  }
};

const createSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ errors: errors.array() });
    }

    const { course, task, date, startTime, durationMinutes, notes, status } = req.body;

    const session = await StudySession.create({
      user: req.user._id,
      course,
      task,
      date,
      startTime,
      durationMinutes,
      notes,
      status
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      res.status(404);
      return res.json({ message: "Study session not found" });
    }

    const updates = req.body;
    Object.assign(session, updates);
    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await StudySession.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      res.status(404);
      return res.json({ message: "Study session not found" });
    }

    res.json({ message: "Study session deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession
};
