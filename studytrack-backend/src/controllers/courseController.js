const { validationResult } = require("express-validator");
const Course = require("../models/Course");

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ user: req.user._id }).sort({ name: 1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user._id });
    if (!course) {
      res.status(404);
      return res.json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ errors: errors.array() });
    }

    const { name, code, instructor, semester } = req.body;

    const course = await Course.create({
      user: req.user._id,
      name,
      code,
      instructor,
      semester
    });

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user._id });
    if (!course) {
      res.status(404);
      return res.json({ message: "Course not found" });
    }

    const updates = req.body;
    Object.assign(course, updates);
    await course.save();
    res.json(course);
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!course) {
      res.status(404);
      return res.json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
