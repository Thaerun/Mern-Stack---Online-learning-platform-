import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Components/SideBar';

const EnrolledStudents = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch the courses taught by the instructor
  useEffect(() => {
    const instructorEmail = localStorage.getItem('instructorEmail'); // Assuming instructor's email is stored in local storage

    if (!instructorEmail) {
      console.error('Instructor email not found in localStorage.');
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructor/courses/${instructorEmail}`, {
          headers: {
            'x-auth-token': localStorage.getItem('instructorToken')
          }
        });
        setCourses(response.data);  // Assuming the server returns the list of courses for the instructor
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students for a specific course
  const fetchStudents = async (courseId) => {
    const instructorEmail = localStorage.getItem('instructorEmail'); // Assuming instructor's email is stored in localStorage

    if (!instructorEmail) {
      console.error('Instructor email not found in localStorage.');
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructor/courses/${instructorEmail}/${courseId}/students`, {
        headers: {
          'x-auth-token': localStorage.getItem('instructorToken')
        }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Handle the course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchStudents(course._id); // Fetch the students for the selected course
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className="flex-grow-1 p-5"
        style={{
          marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust dynamically based on sidebar width
          transition: 'margin-left 0.3s',
        }}
      >
        <h2 className="text-primary mb-4">Enrolled Students Overview</h2>

        <div>
          <h3 className="mb-4">Courses You Teach</h3>
          <div className="list-group">
            {courses.map((course, index) => (
              <button
                key={course._id}
                className="list-group-item list-group-item-action"
                onClick={() => handleCourseSelect(course)}
              >
                {index + 1}. {course.title} {/* Adding serial number */}
              </button>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="mt-5">
            <h3 className="text-primary mb-4">{selectedCourse.title} - Enrolled Students</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th> {/* Serial number column */}
                  <th>Name</th>
                  <th>Email</th>
                  <th>LinkedIn</th>
                  <th>GitHub</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student.email}>
                      <td>{index + 1}</td> {/* Serial number for students */}
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          View LinkedIn
                        </a>
                      </td>
                      <td>
                        <a href={student.githubUrl} target="_blank" rel="noopener noreferrer">
                          View GitHub
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No students enrolled in this course.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudents;
