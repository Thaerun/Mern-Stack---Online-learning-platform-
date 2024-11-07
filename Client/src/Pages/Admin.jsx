import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isInstructorPopupOpen, setIsInstructorPopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchInstructors();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/instructors`);
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const confirmed = window.confirm('Are you sure you want to delete this course? This action cannot be undone.');
    if (confirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/admin/courses/${courseId}`);
        alert('Course deleted successfully');
        fetchCourses(); 
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course');
      }
    } else {
      alert('Course deletion canceled');
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserPopupOpen(true);
  };

  const closeUserPopup = () => {
    setIsUserPopupOpen(false);
    setSelectedUser(null);
  };

  const handleViewInstructorCourses = (instructor) => {
    setSelectedInstructor(instructor);
    setIsInstructorPopupOpen(true);
  };

  const closeInstructorPopup = () => {
    setIsInstructorPopupOpen(false);
    setSelectedInstructor(null);
  };

  return (
    <div className="container-fluid p-5">
      <h1 className="text-primary mb-4">Admin Dashboard</h1>

      <section>
        <h2 className="mb-3">User Management</h2>
        <div className="card p-3 mb-4">
          <h3 className="mb-3">Users List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.purchasedCourses.length} Courses</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleViewUserDetails(user)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3">Instructor Management</h2>
        <div className="card p-3 mb-4">
          <h3 className="mb-3">Instructors List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr key={instructor.email}>
                  <td>{instructor.name}</td>
                  <td>{instructor.email}</td>
                  <td>{instructor.username}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleViewInstructorCourses(instructor)}>
                      View Courses
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3">Course Management</h2>
        <div className="card p-3 mb-4">
          <h3 className="mb-3">Courses List</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.instructorEmail}</td>
                  <td>{course.price}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDeleteCourse(course._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isUserPopupOpen && selectedUser && (
        <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow-lg" style={{ width: '80%', maxWidth: '600px', border: '1px solid #ccc' }}>
            <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" onClick={closeUserPopup}>
              X
            </button>
            <h3>User Details</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>LinkedIn:</strong> <a href={selectedUser.linkedinUrl} target="_blank" rel="noopener noreferrer">View Profile</a></p>
            <p><strong>GitHub:</strong> <a href={selectedUser.githubUrl} target="_blank" rel="noopener noreferrer">View Profile</a></p>
            <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
          </div>
        </div>
      )}

      {isInstructorPopupOpen && selectedInstructor && (
        <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow-lg" style={{ width: '80%', maxWidth: '600px', border: '1px solid #ccc' }}>
            <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" onClick={closeInstructorPopup}>
              X
            </button>
            <h3>{selectedInstructor.name}'s Courses</h3>
            {/* Display courses taught by this instructor */}
            {courses.filter(course => course.instructorEmail === selectedInstructor.email).length > 0 ? (
              courses.filter(course => course.instructorEmail === selectedInstructor.email).map((course, index) => (
                <div key={index} className="course-details">
                  <h4>Course {index + 1}</h4>
                  <p><strong>Title:</strong> {course.title}</p>
                  <p><strong>Description:</strong> {course.description}</p>
                  <p><strong>Price:</strong> ${course.price}</p>

                  {/* Display the list of students enrolled in this course */}
                  <h5>Enrolled Students:</h5>
                  {users.filter(user => user.purchasedCourses && user.purchasedCourses.includes(course._id)).length > 0 ? (
                    users.filter(user => user.purchasedCourses && user.purchasedCourses.includes(course._id)).map((user, idx) => (
                      <div key={idx}>
                        <p><strong>{user.name}</strong> ({user.email})</p>
                      </div>
                    ))
                  ) : (
                    <p>No students enrolled yet.</p>
                  )}
                </div>
              ))
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
