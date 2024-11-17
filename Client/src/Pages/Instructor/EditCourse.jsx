import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../Components/SideBar';

const EditCourse = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { state } = useLocation();
  const { courseId } = useParams();
  console.log(courseId);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseRequirements, setCourseRequirements] = useState(['']);
  const [sections, setSections] = useState([{ title: '', description: '', video: null, videoUrl: '' }]);
  const [courseImage, setCourseImage] = useState(null);
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/courses/edit-courses/${courseId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('instructorToken')
          }
        });
        const { title, price, description, requirements, sections, imageUrl } = response.data;
        setCourseTitle(title);
        setCoursePrice(price);
        setCourseDescription(description);
        setCourseRequirements(requirements);
        setSections(sections.map(section => ({ ...section, video: null })));
        setCourseImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      else{
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleImageUpload = async (file) => {
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('instructorToken'),
         },
      });
      setCourseImageUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSectionVideoUpload = async (index, file) => {
    setIsUploadingVideo(true);
    const updatedSections = [...sections];
    updatedSections[index].video = file;
    setSections(updatedSections);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/upload-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('instructorToken'),
         },
      });

      updatedSections[index].videoUrl = response.data.url;
      setSections(updatedSections);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsUploadingVideo(false);
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
        videoUrl: section.videoUrl,
      })),
      imageUrl: courseImageUrl,
      instructorEmail,
    };

    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/courses/${courseId}`, courseData, {
        headers: {
          'x-auth-token': localStorage.getItem('instructorToken')
        }
      });
      console.log("Course updated successfully:", response.data);
      navigate('/instructor-dashboard'); // Redirect to dashboard after saving
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      {/* Main Content */}
      <div
        className="flex-grow-1 p-5"
        style={{
          marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust dynamically based on sidebar width
          transition: 'margin-left 0.3s',
        }}
      >
        <h2 className="text-primary mb-4">Edit Course</h2>
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
            />
            {isUploadingImage ? <p className="text-primary mt-2">Uploading image...</p> : courseImageUrl && <p className="text-success mt-2">Image uploaded successfully!</p>}
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
                  />
                  {isUploadingVideo ? <p className="text-primary mt-2">Uploading video...</p> : section.videoUrl && <p className="text-success mt-2">Video uploaded successfully!</p>}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
