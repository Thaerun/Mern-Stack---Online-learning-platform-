import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeaderStudent from '../Components/HeaderStudent';

export default function CourseContent( {onLogout} ) {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedSections: [] });
  const [activeSection, setActiveSection] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/course-content`, {
          params: { email: userEmail, courseId },
        });
        setCourse(response.data.course);
        setProgress(response.data.courseProgress || { completedSections: [] });
        setActiveSection(response.data.course.sections[0]); // Set first section as active by default
      } catch (error) {
        console.error('Error fetching course content:', error);
      }
    };

    fetchCourseContent();
  }, [courseId, userEmail]);

  const markSectionComplete = async (sectionId) => {
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/update-progress`, {
        email: userEmail,
        courseId,
        sectionId,
      });
      setProgress((prevProgress) => ({
        ...prevProgress,
        completedSections: [...(prevProgress.completedSections || []), sectionId],
        lastSectionId: sectionId,
      }));
    } catch (error) {
      console.error('Error marking section as complete:', error);
    }
  };

  const isSectionComplete = (sectionId) => {
    return progress?.completedSections?.includes(sectionId);
  };

  const calculateCompletionPercentage = () => {
    const completed = progress?.completedSections?.length || 0;
    const total = course?.sections?.length || 1;
    return Math.round((completed / total) * 100);
  };

  const generateCertificate = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/generate-certificate`,
        {
          userEmail: userEmail, // Send the user's email
          courseTitle: course.title, // Send the course title
          completionDate: new Date().toLocaleDateString(), // Send today's date
        }
      );
  
      // Get the filename and file content (base64)
      const { filename, file } = response.data;
  
      // Convert the base64 string back to a Blob
      const byteCharacters = atob(file); // Decode base64 string to binary
      const byteArrays = [];
  
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
  
      const fileBlob = new Blob(byteArrays, { type: 'application/pdf' });
  
      // Create a download link and trigger download with the correct filename
      const downloadUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename); // Use the filename from the response
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };
  
  

  return (
    <>
      <HeaderStudent onLogout={onLogout}/>
      <div className="container-fluid p-0">
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-md-3 bg-light border-end d-none d-md-block" style={{ height: 'calc(99vh - 56px)', overflowY: 'auto' }}>
            <div className="p-3">
              <h4 className="mb-3">Course Content</h4>
              <div className="progress mb-3" style={{ height: '8px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${calculateCompletionPercentage()}%` }}
                  aria-valuenow={calculateCompletionPercentage()}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <p className="text-muted mb-4">{calculateCompletionPercentage()}% complete</p>
              {course?.sections.map((section, index) => (
                <div
                  key={section._id}
                  className={`mb-2 ${activeSection?._id === section._id ? 'border border-primary rounded' : ''}`}
                >
                  <button
                    className={`btn btn-link text-start w-100 p-2 d-flex justify-content-between align-items-center ${isSectionComplete(section._id) ? 'text-success' : ''}`}
                    onClick={() => setActiveSection(section)}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      backgroundColor: activeSection?._id === section._id ? '#f0f8ff' : 'transparent',
                    }}
                  >
                    <span>
                      {index + 1}. {section.title}
                    </span>
                    {isSectionComplete(section._id) && (
                      <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.5em' }} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-12" style={{ height: 'calc(99vh - 56px)', overflowY: 'auto' }}>
            {activeSection ? (
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>{activeSection.title}</h2>

                  {/* Mark as Complete Button */}
                  <button
                    className={`btn ${isSectionComplete(activeSection._id) ? 'btn-outline-success' : 'btn-primary'}`}
                    onClick={() => markSectionComplete(activeSection._id)}
                    disabled={isSectionComplete(activeSection._id)}
                  >
                    {isSectionComplete(activeSection._id) ? (
                      <>
                        {/* <i className="bi bi-check-circle-fill me-2"></i> */}
                        Completed
                      </>
                    ) : (
                      <>
                        {/* <i className="bi bi-play-fill me-2"></i> */}
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>

                {/* Video Container with 16:9 ratio */}
                <div className="mb-4" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                  <video
                    src={activeSection.videoUrl}
                    title={activeSection.title}
                    controls
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                  />
                </div>

                <p className="mb-4">{activeSection.description}</p>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center h-100">
                <p>Select a section to start learning</p>
              </div>
            )}
          </div>
        </div>

        {/* Completion Alert */}
        {calculateCompletionPercentage() === 100 && (
          <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4">
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Congratulations! 🎉</h4>
              <p className="mb-0">You have completed this course. Great job!</p>
              {/* Button to download certificate */}
              <button
                className="btn btn-success mt-3"
                onClick={generateCertificate}
              >
                Download Certificate
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
