const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const express = require('express');
const Instructor = require('../models/Instructor');
const Course = require('../models/Course');
const User = require('../models/User');
const Otp = require('../models/Otp');
const transporter = require('../utils/email');
const authMiddleware = require('../middleware/auth');
const { upload, imageUpload, imageUploadProfile } = require('../utils/cloudinary');
require('dotenv').config();

const router = express.Router();
JWT_SECRET = process.env.JWT_SECRET;

// Instructor Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const instructor = new Instructor({ email, password: hashedPassword, verificationToken, });
        await instructor.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/instructors/verify-email-instructor?token=${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        res.status(201).send('Instructor created. Please check your email to verify your account.');
    } catch (error) {
        res.status(400).send('Instructor already exists');
    }
});

// Email Verification Route
router.get('/verify-email-instructor', async (req, res) => {
    const { token } = req.query;
    
    try {
        // Find user by token
        const instructor = await Instructor.findOne({ verificationToken: token });
        if (!instructor) {
            return res.status(400).send('Invalid or expired token');
        }

        // Mark the email as verified and remove the token
        instructor.isEmailVerified = true;
        instructor.verificationToken = undefined;
        await instructor.save();

        res.send('Email verified successfully. You can now log in.');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// instructor Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const instructor = await Instructor.findOne({ email });
    if (!instructor) return res.status(400).send('Instructor not found');

    // Check if email is verified
    if (!instructor.isEmailVerified) {
        return res.status(403).send('Please verify your email before logging in');
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    // Create JWT
    const token = jwt.sign({ userId: instructor._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});


// Send OTP Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await Instructor.findOne({ email });
        if (!user) return res.status(404).send('Instructor not found');

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const expiresAt = new Date(Date.now() + 10 * 60000);
        await Otp.create({ email, otp, expiresAt });

        // Send OTP email
        await transporter.sendMail({
            to: email,
            subject: 'Your OTP for Password Reset',
            html: `<p>Your OTP for password reset is <strong>${otp}</strong>. The OTP is valid only for next 10 minutes.</p>`,
        });

        res.send('OTP sent to your email.');
    } catch (error) {
        console.error('Error sending OTP', error);
        res.status(500).send('Error sending OTP');
    }
});

// Update Password Route (to be called after OTP verification)
router.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Instructor.updateOne({ email }, { password: hashedPassword });
        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating password');
    }
});

// Verify OTP Route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    // Check if the OTP exists and is not expired
    const otpEntry = await Otp.findOne({ email, otp });
    if (otpEntry && otpEntry.expiresAt > new Date()) {
        // OTP is valid, allow user to update their password
        await Otp.deleteOne({ email }); // Remove OTP after use
        res.send('OTP verified. You can now reset your password.');
    } else {
        res.status(400).send('Invalid or expired OTP');
    }
});

// GET instructor profile
router.get('/:instructorEmail', authMiddleware, async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ email: req.params.instructorEmail });
        if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
        res.json(instructor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

// PUT update instructor profile (excluding email)
router.put('/:instructorEmail', authMiddleware, async (req, res) => {
    const { name, username, linkedinUrl, githubUrl, phoneNumber, imageUrl } = req.body;

    try {
        const updatedInstructor = await Instructor.findOneAndUpdate(
            { email: req.params.instructorEmail },
            { name, username, linkedinUrl, githubUrl, phoneNumber, imageUrl },
            { new: true }
        );

        if (!updatedInstructor) return res.status(404).json({ message: 'Instructor not found' });
        res.json(updatedInstructor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});

// API route for uploading profile image
router.post('/upload-profile-image', authMiddleware, imageUploadProfile.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('No image uploaded');

    try {
        const imageUrl = req.file.path; // Cloudinary URL of the uploaded image

        // Update the instructor's profile with the image URL
        const instructorEmail = req.body.email;  // Assuming you are passing the instructor's email to identify them
        const instructor = await Instructor.findOne({ email: instructorEmail });

        if (!instructor) {
            return res.status(404).send('Instructor not found');
        }

        instructor.imageUrl = imageUrl;  // Update the imageUrl field in the database

        await instructor.save();

        res.json({ message: 'Profile image uploaded successfully', imageUrl: imageUrl });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send('Internal server error');
    }
});


// Fetch students enrolled in a specific course, only for the instructor who created the course
router.get('/courses/:instructorEmail/:courseId/students', authMiddleware, async (req, res) => {
    try {
      const { courseId, instructorEmail } = req.params;  // Get courseId and instructorEmail from route parameters
  
      if (!instructorEmail || !courseId) {
        return res.status(400).json({ message: 'Instructor email and course ID are required.' });
      }
  
      // Fetch the course by its ID and validate if the instructor is the owner
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }
  
      if (course.instructorEmail !== instructorEmail) {
        return res.status(403).json({ message: 'You are not authorized to view this course.' });
      }
  
      // Fetch students enrolled in this course using the course ID
      const students = await User.find({ purchasedCourses: courseId });
  
      // Send the students' information (name, email, LinkedIn, GitHub)
      const studentsDetails = students.map(student => ({
        name: student.name,
        email: student.email,
        linkedinUrl: student.linkedinUrl,
        githubUrl: student.githubUrl,
      }));
  
      return res.json(studentsDetails);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  // Fetch all courses taught by a specific instructor
router.get('/courses/:instructorEmail', authMiddleware, async (req, res) => {
    try {
      const { instructorEmail } = req.params;  // Get instructor's email from route parameters
  
      if (!instructorEmail) {
        return res.status(400).json({ message: 'Instructor email is required.' });
      }
  
      // Find all courses where the instructor's email matches
      const courses = await Course.find({ instructorEmail });
  
      // If no courses found
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: 'No courses found for this instructor.' });
      }
  
      // Return the list of courses
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Get courses by instructor email
router.post('/courses', authMiddleware, async (req, res) => {
    const { instructorEmail } = req.body; 

    try {
        const courses = await Course.find({ instructorEmail }); 
        res.json(courses); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Delete course Route
router.delete('/courses/:id', authMiddleware, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting course' });
    }
});

// Get course by ID Route
router.get('/courses/edit-courses/:id', authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching course' });
    }
});

// Edit course Route
router.put('/courses/:id', authMiddleware, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating course' });
    }
});

// Video upload route using Cloudinary
router.post('/upload-video', authMiddleware, upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    // The Cloudinary URL and public ID are returned in req.file.path and req.file.filename
    res.json({ url: req.file.path, publicId: req.file.filename });
});

// Image upload route using Cloudinary (new route)
router.post('/upload-image',authMiddleware, imageUpload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ url: req.file.path, publicId: req.file.filename });
});

// Update the Course creation route to accept video URLs from Cloudinary
router.post('/create-course',authMiddleware, async (req, res) => {
    const { title, price, description, requirements, sections, instructorEmail, imageUrl } = req.body;

    try {
        // Create a new course with Cloudinary URLs in the videoUrl field
        const course = new Course({
            title,
            price,
            description,
            imageUrl,
            requirements,
            sections: sections.map((section) => ({
                title: section.title,
                description: section.description,
                videoUrl: section.videoUrl, // Cloudinary URL for each video
            })),
            instructorEmail,
        });
        
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating course' });
    }
});

module.exports = router;