const express = require('express');
const Instructor = require('../models/Instructor');
const User = require('../models/User');
const Course = require('../models/Course');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 1. Get all users
router.get('/users',authMiddleware, async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });
  
  // 2. Get all instructors
  router.get('/instructors',authMiddleware, async (req, res) => {
    try {
      const instructors = await Instructor.find();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructors' });
    }
  });
  
  // 3. Get all courses
  router.get('/courses', authMiddleware, async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses' });
    }
  });
  
  // 4. Delete course
  router.delete('/courses/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await Course.findByIdAndDelete(id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting course' });
    }
  });
  
  // 5. Get a single instructor's courses
  router.get('/instructors/:email/courses', authMiddleware, async (req, res) => {
    try {
      const { email } = req.params;
      const instructorCourses = await Course.find({ instructorEmail: email });
      res.json(instructorCourses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructor courses' });
    }
  });

  // Dont know whether it should present in the admin page or not

module.exports = router;