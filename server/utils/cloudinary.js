// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

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

// Configure Multer storage for Cloudinary images (new code)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'course_images', // Folder for images
        resource_type: 'image',  // Ensure Cloudinary treats this as an image upload
    },
});
const imageUpload = multer({ storage: imageStorage });

// Multer storage for Cloudinary images profle pics
const imageStorageProfile = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'instructor_profiles', // Folder for profile images
        resource_type: 'image',  // Ensures Cloudinary treats this as an image upload
    },
});

const imageUploadProfile = multer({ storage: imageStorageProfile });

// Multer storage for Cloudinary images profle pics
const imageStorageProfileUser = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_profiles', // Folder for profile images
        resource_type: 'image',  // Ensures Cloudinary treats this as an image upload
    },
});

const imageUploadProfileUser = multer({ storage: imageStorageProfileUser });

module.exports = { upload, imageUpload, imageUploadProfile, imageUploadProfileUser };