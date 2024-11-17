const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const express = require('express');
const User = require('../models/User');
const Otp = require('../models/Otp');
const Course = require('../models/Course');
const Instructor = require('../models/Instructor');
const transporter = require('../utils/email');
const authMiddleware = require('../middleware/auth');
const path = require('path');
const { generateCertificate } = require('../utils/CertificateGenerator');
const { imageUploadProfileUser } = require('../utils/cloudinary');
require('dotenv').config();

const router = express.Router();

JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = new User({ email, password: hashedPassword, verificationToken, });
        await user.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/users/verify-email?token=${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        });

        res.status(201).send('User created. Please check your email to verify your account.');
    } catch (error) {
        res.status(400).send('User already exists');
    }
});

// Email Verification Route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    
    try {
        // Find user by token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).send('Invalid or expired token');
        }

        // Mark the email as verified and remove the token
        user.isEmailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send('Email verified successfully. You can now log in.');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    // Check if email is verified
    if (!user.isEmailVerified) {
        return res.status(403).send('Please verify your email before logging in');
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    // Create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Send OTP Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('User not found');

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

// Update Password Route (to be called after OTP verification)
router.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });
        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating password');
    }
});

// Route to add purchased course in payment page
router.put('/addCourse', authMiddleware, async (req, res) => {
    const { email, courseId } = req.body;
  
    try {
      await User.updateOne(
        { email },
        { $addToSet: { purchasedCourses: courseId } } // $addToSet ensures no duplicates
      );
      res.status(200).json({ message: "Course added to purchased courses." });
    } catch (error) {
      console.error("Error adding course to purchasedCourses:", error);
      res.status(500).json({ message: "Failed to update purchased courses." });
    }
  });

// GET user profile for student profile page
router.get('/student/:userEmail', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.userEmail });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

// PUT update user profile (excluding email) for student profile page
router.put('/student/:userEmail', authMiddleware, async (req, res) => {
    const { name, username, linkedinUrl, githubUrl, phoneNumber, imageUrl } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.userEmail },
            { name, username, linkedinUrl, githubUrl, phoneNumber, imageUrl },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});

// API route for uploading profile image for student profile page
router.post('/upload-profile-image-user', authMiddleware, imageUploadProfileUser.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send('No image uploaded');

    try {
        const imageUrl = req.file.path; // Cloudinary URL of the uploaded image

        // Update the instructor's profile with the image URL
        const userEmail = req.body.email;  // Assuming you are passing the instructor's email to identify them
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.imageUrl = imageUrl;  // Update the imageUrl field in the database

        await user.save();

        res.json({ message: 'Profile image uploaded successfully', imageUrl: imageUrl });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send('Internal server error');
    }
});

  // Route to get the user's name based on email (studentdashboard)
  router.get('/name', authMiddleware, async (req, res) => {
    try {
      const { email } = req.query; // Get email from query parameters
      const user = await User.findOne({ email }, 'name'); // Fetch only the name field
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      //console.log(user.name);
      res.json({ name: user.name });
    } catch (error) {
      console.error("Error fetching user name:", error);
      res.status(500).json({ message: "Server error while fetching user name" });
    }
  });

    // Get all courses for StudentDashboard
router.get('/student-dashboard/courses', authMiddleware, async (req, res) => {
    try {
        // Retrieve all courses
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Endpoint to fetch the courses a user has purchased along with progress
router.get('/student-dashboard/my-courses', authMiddleware, async (req, res) => {
    try {
        const { email } = req.query;  // Get the user's email from query parameters

        // Find the user by email
        const user = await User.findOne({ email }).populate('purchasedCourses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get purchased courses and progress
        const purchasedCoursesWithProgress = user.purchasedCourses.map(course => {
            const progress = user.coursesProgress.find(cp => cp.courseId.toString() === course._id.toString());
            const completionPercentage = progress
                ? Math.round((progress.completedSections.length / course.sections.length) * 100)
                : 0;

            return {
                _id: course._id,
                title: course.title,
                description: course.description,
                imageUrl: course.imageUrl,
                completionPercentage
            };
        });

        res.json(purchasedCoursesWithProgress);
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({ message: 'Error fetching purchased courses' });
    }
});

// Get course content by courseId
router.get('/course-content', authMiddleware, async (req, res) => {
    const { email, courseId } = req.query;
  
    try {
      const course = await Course.findById(courseId).populate('sections');
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Retrieve the user's progress for this course
      const courseProgress = user.coursesProgress.find(cp => cp.courseId.toString() === courseId);
  
      res.json({ course, courseProgress });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching course content' });
    }
  });

// Mark section as completed and update last-viewed section
router.post('/update-progress', authMiddleware, async (req, res) => {
    const { email, courseId, sectionId } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const courseProgress = user.coursesProgress.find(cp => cp.courseId.toString() === courseId);
      
      if (courseProgress) {
        // Update completed sections and last-viewed section
        if (!courseProgress.completedSections.includes(sectionId)) {
          courseProgress.completedSections.push(sectionId);
        }
        courseProgress.lastSectionId = sectionId;
      } else {
        // If no progress exists, initialize progress for the course
        user.coursesProgress.push({
          courseId,
          completedSections: [sectionId],
          lastSectionId: sectionId,
        });
      }
  
      await user.save();
      res.json({ message: 'Progress updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating progress' });
    }
  });

  router.post('/generate-certificate', authMiddleware, async (req, res) => {
    const { userEmail, courseTitle, completionDate } = req.body;
  
    try {
      // Fetch user details by email from the User collection
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Generate the certificate
      const certificatePath = await generateCertificate(user.name, courseTitle, completionDate);
  
      // Get the filename from the certificate path
      const fileName = path.basename(certificatePath); // e.g. "John_Doe_CourseTitle_certificate.pdf"
  
      // Read the certificate file content into a buffer
      const fs = require('fs');
      const fileContent = fs.readFileSync(certificatePath);
  
      // Send both the filename and the PDF blob as part of the response
      res.json({
        filename: fileName,
        file: fileContent.toString('base64') // Convert the file to base64 string
      });
  
    } catch (error) {
      console.error('Error generating certificate:', error);
      res.status(500).send('Error generating certificate');
    }
  });
 
  // Endpoint to check if the user has already purchased the course
router.post('/check-course-purchase', authMiddleware, async (req, res) => {
    try {
        const { userEmail, courseId } = req.body;

        //console.log("Received check-course-purchase request:", req.body); // Debug log

        // Find the user by their email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the course is in the purchasedCourses array
        const isPurchased = user.purchasedCourses.some(course => course.toString() === courseId);

        // Send routerropriate response based on purchase status
        if (isPurchased) {
            return res.json({ message: 'User has already purchased this course' });
        } else {
            return res.json({ message: 'User has not purchased this course' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all courses for header student
router.get('/courses', authMiddleware, async (req, res) => {
    try {
        const courses = await Course.find({}).select('_id title');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
  });
  
  // Fetch user by email to get purchased courses for header student
  router.get('/:email', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('purchasedCourses');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
  });

  router.get('/instructors/:instructorEmail', authMiddleware, async(req, res) => {
    const { instructorEmail } = req.params;
    try{
        const instructor = await Instructor.findOne({ email: instructorEmail });
        if (!instructor) {
          return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
});

router.get('/courses/:courseId', authMiddleware, async(req, res) => {
    const { courseId } = req.params;
    try{
        const course = await Course.findOne({_id: courseId});
        if(!course){
            return res.status(404).json({message: 'Course not found'});
        }
        res.json(course);
    }
    catch(error){
        console.error("Error fetching course details: ", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

module.exports = router;