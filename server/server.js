const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const { generateCertificate } = require('./CertificateGenerator');

const app = express();
require('dotenv').config();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET; // Use a more secure value and store in env variables

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));

    const userSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isEmailVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Array of course IDs
    
        // Array to track progress in each purchased course
        coursesProgress: [
            {
                courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
                completedSections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }], // Track completed sections
                lastSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' }, // Track last-viewed section for resuming
            },
        ],
            
        // Additional fields for instructor profile
        name: { type: String },
        username: { type: String },
        linkedinUrl: { type: String },
        githubUrl: { type: String },
        phoneNumber: { type: String },
        imageUrl: { type: String }

    });
    
    // User Model
    const User = mongoose.model('User', userSchema);
    


// Instructor Schema
const instructorSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // Additional fields for instructor profile
    name: { type: String },
    username: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    phoneNumber: { type: String },
    imageUrl: { type: String }
});

// Instructor Model
const Instructor =mongoose.model('Instructor', instructorSchema);


// OTP Schema
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

//OTP model
const Otp = mongoose.model('Otp', otpSchema);

// Update sections in Course schema
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true},
    requirements: [String],
    sections: [
        {
            title: String,
            description: String,
            videoUrl: String, // Stores Cloudinary URL
        },
    ],
    instructorEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.model('Course', courseSchema);


const threadSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    messages: [
      {
        userName: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  });
  
  const Thread = mongoose.model('Thread', threadSchema);



// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = new User({ email, password: hashedPassword, verificationToken, });
        await user.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/verify-email?token=${verificationToken}`;
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
app.get('/verify-email', async (req, res) => {
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
app.post('/login', async (req, res) => {
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

// Protect Route (middleware example)
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    // console.log(token);
    if (!token) return res.status(401).send('No token, authorization denied');
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).send('Token is not valid');
    }
};


// Send OTP Route
app.post('/forgot-password', async (req, res) => {
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
app.post('/verify-otp', async (req, res) => {
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
app.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });
        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating password');
    }
});


// Instructor Signup Route
app.post('/instructor/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const instructor = new Instructor({ email, password: hashedPassword, verificationToken, });
        await instructor.save();

        // Send verification email
        const verificationUrl = `http://localhost:5000/verify-email-instructor?token=${verificationToken}`;
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
app.get('/verify-email-instructor', async (req, res) => {
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
app.post('/instructor/login', async (req, res) => {
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
app.post('/instructor/forgot-password', async (req, res) => {
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
app.post('/instructor/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await Instructor.updateOne({ email }, { password: hashedPassword });
        res.send('Password updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating password');
    }
});


//Cloudinary Code
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_videos', // Optional: specify a folder in Cloudinary
        resource_type: 'video', // Ensures Cloudinary treats this as a video upload
    },
});

const upload = multer({ storage });

// Video upload route using Cloudinary
app.post('/upload-video', authMiddleware, upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    // The Cloudinary URL and public ID are returned in req.file.path and req.file.filename
    res.json({ url: req.file.path, publicId: req.file.filename });
});

// Configure Multer storage for Cloudinary images (new code)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_images', // Folder for images
        resource_type: 'image',  // Ensure Cloudinary treats this as an image upload
    },
});
const imageUpload = multer({ storage: imageStorage });

// Image upload route using Cloudinary (new route)
app.post('/upload-image',authMiddleware, imageUpload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');
    res.json({ url: req.file.path, publicId: req.file.filename });
});

// Update the Course creation route to accept video URLs from Cloudinary
app.post('/create-course',authMiddleware, async (req, res) => {
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

// Get courses by instructor email
app.post('/courses', authMiddleware, async (req, res) => {
    const { instructorEmail } = req.body; 

    try {
        const courses = await Course.find({ instructorEmail }); 
        res.json(courses); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});


// Get course by ID Route
app.get('/courses/:id', authMiddleware, async (req, res) => {
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
app.put('/courses/:id', authMiddleware, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating course' });
    }
});

// Delete course Route
app.delete('/courses/:id', authMiddleware, async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting course' });
    }
});

// GET instructor profile
app.get('/instructor/:instructorEmail', authMiddleware, async (req, res) => {
    try {
        const instructor = await Instructor.findOne({ email: req.params.instructorEmail });
        if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
        res.json(instructor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

// PUT update instructor profile (excluding email)
app.put('/instructor/:instructorEmail', authMiddleware, async (req, res) => {
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


// Multer storage for Cloudinary images profle pics
const imageStorageProfile = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'instructor_profiles', // Folder for profile images
        resource_type: 'image',  // Ensures Cloudinary treats this as an image upload
    },
});

const imageUploadProfile = multer({ storage: imageStorageProfile });

// API route for uploading profile image
app.post('/upload-profile-image', authMiddleware, imageUploadProfile.single('image'), async (req, res) => {
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


// Student Dashboard Courses page
// Get all courses for StudentDashboard
app.get('/student-dashboard/courses', authMiddleware, async (req, res) => {
    try {
        // Retrieve all courses
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

app.get('/student-dashboard/courses/:courseId', authMiddleware, async(req, res) => {
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

app.get('/instructors/:instructorEmail', authMiddleware, async(req, res) => {
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

// Route to add purchased course
app.put('/users/addCourse', authMiddleware, async (req, res) => {
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


// Endpoint to check if the user has already purchased the course
app.post('/users/check-course-purchase', authMiddleware, async (req, res) => {
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

        // Send appropriate response based on purchase status
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

// Endpoint to fetch the courses a user has purchased along with progress
app.get('/student-dashboard/my-courses', authMiddleware, async (req, res) => {
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
app.get('/student-dashboard/course-content', authMiddleware, async (req, res) => {
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
app.post('/student-dashboard/update-progress', authMiddleware, async (req, res) => {
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
  


// GET instructor profile
app.get('/student/:userEmail', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.userEmail });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

// PUT update instructor profile (excluding email)
app.put('/student/:userEmail', authMiddleware, async (req, res) => {
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


// Multer storage for Cloudinary images profle pics
const imageStorageProfileUser = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // Folder for profile images
        resource_type: 'image',  // Ensures Cloudinary treats this as an image upload
    },
});

const imageUploadProfileUser = multer({ storage: imageStorageProfileUser });

// API route for uploading profile image
app.post('/upload-profile-image-user', authMiddleware, imageUploadProfileUser.single('image'), async (req, res) => {
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



// 1. Get all users
app.get('/admin/users',authMiddleware, async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  });
  
  // 2. Get all instructors
  app.get('/admin/instructors',authMiddleware, async (req, res) => {
    try {
      const instructors = await Instructor.find();
      res.json(instructors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructors' });
    }
  });
  
  // 3. Get all courses
  app.get('/admin/courses', authMiddleware, async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching courses' });
    }
  });
  
  // 4. Delete course
  app.delete('/admin/courses/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await Course.findByIdAndDelete(id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting course' });
    }
  });
  
  // 5. Get a single instructor's courses
  app.get('/admin/instructors/:email/courses', authMiddleware, async (req, res) => {
    try {
      const { email } = req.params;
      const instructorCourses = await Course.find({ instructorEmail: email });
      res.json(instructorCourses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructor courses' });
    }
  });


// Fetch all courses taught by a specific instructor
app.get('/instructor/courses/:instructorEmail', authMiddleware, async (req, res) => {
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
  
  // Fetch students enrolled in a specific course, only for the instructor who created the course
  app.get('/instructor/courses/:instructorEmail/:courseId/students', authMiddleware, async (req, res) => {
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

// Get all messages for a specific course's discussion thread
app.get('/student-dashboard/forums/:courseId/threads', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the thread for the given course
    const thread = await Thread.findOne({ courseId });
    
    // If no thread exists yet, return an empty array
    if (!thread) {
      return res.json([]); 
    }

    res.json(thread.messages);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ message: "Server error while fetching threads." });
  }
});

// Post a new message to a specific course's discussion thread
app.post('/student-dashboard/forums/:courseId/threads', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userName, message } = req.body; // Expect 'userName' and 'message' in request body

    // Find the thread by courseId or create a new one if it doesn't exist
    let thread = await Thread.findOne({ courseId });
    if (!thread) {
      thread = new Thread({ courseId, messages: [] });
    }

    // Add the new message with userName and message content
    thread.messages.push({ userName, message });
    await thread.save();

    res.status(201).json({ userName, message });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ message: "Server error while posting message." });
  }
});


// Route to get the user's name based on email
app.get('/api/users/name', authMiddleware, async (req, res) => {
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


  app.post('/generate-certificate', authMiddleware, async (req, res) => {
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

// Fetch all courses
app.get('/api/courses', authMiddleware, async (req, res) => {
  try {
      const courses = await Course.find({}).select('_id title');
      res.json(courses);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching courses' });
  }
});

// Fetch user by email to get purchased courses
app.get('/api/users/:email', authMiddleware, async (req, res) => {
  try {
      const user = await User.findOne({ email: req.params.email }).select('purchasedCourses');
      res.json(user);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
