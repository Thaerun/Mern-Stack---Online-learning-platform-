import React, { useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateCourse = ({ onLogout }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseRequirements, setCourseRequirements] = useState(['']);
  const [sections, setSections] = useState([{ title: '', description: '', video: null, videoUrl: '' }]);
  const [courseImage, setCourseImage] = useState(null);
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Handlers for form input fields
  const handleAddRequirement = () => setCourseRequirements([...courseRequirements, '']);
  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...courseRequirements];
    updatedRequirements[index] = value;
    setCourseRequirements(updatedRequirements);
  };
  const handleRemoveRequirement = (index) => {
    const updatedRequirements = courseRequirements.filter((_, i) => i !== index);
    setCourseRequirements(updatedRequirements);
  };

  const handleAddSection = () => setSections([...sections, { title: '', description: '', video: null, videoUrl: '' }]);
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  // Handle Image Upload
  const handleImageUpload = async (file) => {
    setIsUploadingImage(true); // Show loading indicator
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCourseImageUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false); // Hide loading indicator
    }
  };

  // Handle Video Upload for Sections
  const handleSectionVideoUpload = async (index, file) => {
    setIsUploadingVideo(true); // Show loading indicator
    const updatedSections = [...sections];
    updatedSections[index].video = file;
    setSections(updatedSections);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updatedSections[index].videoUrl = response.data.url;
      setSections(updatedSections);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsUploadingVideo(false); // Hide loading indicator
    }
  };

  const handleRemoveSection = (index) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const instructorEmail = localStorage.getItem('instructorEmail');
    const courseData = {
      title: courseTitle,
      price: coursePrice,
      description: courseDescription,
      requirements: courseRequirements.filter(req => req),
      sections: sections.map(section => ({
        title: section.title,
        description: section.description,
        videoUrl: section.videoUrl, // only submit the video URL, not the file
      })),
      imageUrl: courseImageUrl,
      instructorEmail,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/create-course`, courseData);
      console.log("Course created successfully:", response.data);
      window.location.reload(); // to relaod the page so that the fields gets reset
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-primary text-white p-4" style={{ width: '250px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <h2 className="text-center mb-4">Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <a href="/instructor-dashboard" className="nav-link text-white">
              <i className="bi bi-journal-text"></i> My Courses
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="/create-course" className="nav-link text-white">
              <i className="bi bi-plus-circle"></i> Create a Course
            </a>
          </li>
          <li className="nav-item">
            <a href="/earnings" className="nav-link text-white">
              <i className="bi bi-cash-stack"></i> Earnings
            </a>
          </li>
        </ul>
        <button className="btn btn-primary" onClick={onLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5" style={{ marginLeft: '250px' }}>
        <h2 className="text-primary mb-4">Create New Course</h2>
        <form onSubmit={handleSubmit}>
          {/* Course Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">Course Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={courseTitle} 
              onChange={(e) => setCourseTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Course Price */}
          <div className="mb-3">
            <label className="form-label fw-bold">Course Price ($)</label>
            <input 
              type="number" 
              className="form-control" 
              value={coursePrice} 
              onChange={(e) => setCoursePrice(e.target.value)} 
              required 
            />
          </div>

          {/* Course Description */}
          <div className="mb-3">
            <label className="form-label fw-bold">Course Description</label>
            <textarea 
              className="form-control" 
              rows="4" 
              value={courseDescription} 
              onChange={(e) => setCourseDescription(e.target.value)} 
              required 
            />
          </div>

          {/* Course Image Upload */}
          <div className="mb-3">
            <label className="form-label fw-bold">Course Image</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e.target.files[0])} 
              required 
            />
            {isUploadingImage && <p className="text-primary mt-2">Uploading image...</p>}
          </div>

          {/* Course Requirements */}
          <div className="mb-3">
            <label className="form-label fw-bold">Course Requirements</label>
            {courseRequirements.map((requirement, index) => (
              <div key={index} className="input-group mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  value={requirement} 
                  onChange={(e) => handleRequirementChange(index, e.target.value)} 
                  placeholder="Requirement"
                  required
                />
                <button 
                  type="button" 
                  className="btn btn-outline-danger" 
                  onClick={() => handleRemoveRequirement(index)}
                >
                  Remove
                </button>
              </div>
            ))} 
            <button 
              type="button" 
              className="btn btn-outline-primary mt-3" 
              onClick={handleAddRequirement}
            >
              Add Requirement
            </button>
          </div>

          {/* Course Sections */}
          <h4 className="text-primary mt-4">Course Sections</h4>
          {sections.map((section, index) => (
            <div key={index} className="card my-3 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Section {index + 1}</h5>

                {/* Section Title */}
                <div className="mb-3">
                  <label className="form-label">Section Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={section.title} 
                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)} 
                    required 
                  />
                </div>

                {/* Section Description */}
                <div className="mb-3">
                  <label className="form-label">Section Description</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    value={section.description} 
                    onChange={(e) => handleSectionChange(index, 'description', e.target.value)} 
                    required 
                  />
                </div>

                {/* Section Video Upload */}
                <div className="mb-3">
                  <label className="form-label">Upload Video</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    accept="video/*" 
                    onChange={(e) => handleSectionVideoUpload(index, e.target.files[0])} 
                    required 
                  />
                  {isUploadingVideo && <p className="text-primary mt-2">Uploading video...</p>}
                </div>

                <button 
                  type="button" 
                  className="btn btn-outline-danger" 
                  onClick={() => handleRemoveSection(index)}
                >
                  Remove Section
                </button>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            className="btn btn-outline-primary mt-3" 
            onClick={handleAddSection}
          >
            Add Section
          </button>

          {/* Submit Button */}
          <div className="mt-4">
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isUploadingImage || isUploadingVideo}>
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
