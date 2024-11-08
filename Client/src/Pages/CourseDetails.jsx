import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderStudent from '../Components/HeaderStudent';

export default function CourseDetails( {onLogout} ) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  console.log(userEmail);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses/${courseId}`);
        setCourse(courseResponse.data);

        const instructorResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructors/${courseResponse.data.instructorEmail}`);
        setInstructor(instructorResponse.data);

        // Check if the user is already enrolled
        const userResponse = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/check-course-purchase`, {
          userEmail: userEmail,
          courseId: courseId
        });

        // If user has purchased the course, set isEnrolled to true
        setIsEnrolled(userResponse.data.message === 'User has already purchased this course');
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    fetchCourseDetails();
  }, [courseId, userEmail]);

  // Handle enroll button click
  const handleEnroll = () => {
    if (!isEnrolled) {
      navigate('/payment', { 
        state: { 
          courseId: course._id, 
          courseName: course.title, 
          price: course.price 
        } 
      });
    }
  };

  if (!course || !instructor) return <div className="container mt-5 text-center">Loading...</div>;

  return (
    <>
      <HeaderStudent onLogout={onLogout}/>
      <div className="container-fluid p-0">
        {/* Course Header */}
        <div className="bg-dark text-white py-5" style={{ backgroundColor: '#1c1d1f' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>{course.title}</h1>
                <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#d1d7dc' }}>{course.description}</p>
                <div className="d-flex align-items-center mb-4">
                  <img 
                    src={instructor.imageUrl} 
                    alt={instructor.name}
                    className="rounded-circle me-3" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                  />
                  <span style={{ fontSize: '1rem', color: '#d1d7dc' }}>
                    Created by <strong>{instructor.name}</strong>
                  </span>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <img src={course.imageUrl} alt="Course Banner" className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title" style={{ fontSize: '2rem', fontWeight: '700' }}>
                      {course.price > 0 ? `₹${course.price.toFixed(2)}` : 'Free'}
                    </h5>
                    <button 
                      className={`btn btn-lg w-100 mb-3 ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`} 
                      style={{ fontSize: '1.2rem' }}
                      onClick={handleEnroll} // Add onClick event
                      disabled={isEnrolled} // Disable button if enrolled
                    >
                      {isEnrolled ? 'Enrolled' : (course.price > 0 ? 'Enroll now' : 'Start learning now')}
                    </button>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>30-Day Money-Back Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-lg-8">
              {/* Requirements */}
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="card-title" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Requirements</h2>
                  <ul className="list-unstyled">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Course content */}
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Course content</h2>
                  <div className="accordion" id="courseContent">
                    {course.sections.map((section, index) => (
                      <div key={section._id} className="accordion-item">
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="false"
                            aria-controls={`collapse${index}`}
                            style={{ fontSize: '1rem' }}
                          >
                            Section {index + 1}: {section.title}
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#courseContent"
                        >
                          <div className="accordion-body" style={{ fontSize: '0.9rem' }}>
                            {section.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Instructor */}
              <div className="card mb-4">
                <div className="card-body">
                  <h2 className="card-title" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Instructor</h2>
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={instructor.imageUrl} 
                      alt={instructor.name}
                      className="rounded-circle me-3" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                    />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{instructor.name}</h3>
                      <p className="text-muted" style={{ fontSize: '0.9rem' }}>{instructor.title || 'Course Instructor'}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem' }}>{instructor.bio || 'Experienced instructor passionate about teaching.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-light mt-5 py-4">
          <div className="container text-center">
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>&copy; 2024 Your Course Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
