import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderStudent from '../Components/HeaderStudent';

const StudentDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('allCourses');
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [threads, setThreads] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState(''); // State to store userName
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');

  // Fetch the user's name using their email
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/name`,
          { params: { email: userEmail } }
        );
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [userEmail]);

  // Fetch all available courses and user-specific courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching all courses:", error);
      }
    };

    const fetchMyCourses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/my-courses`, {
          params: { email: userEmail }
        });
        setMyCourses(response.data);
      } catch (error) {
        console.error("Error fetching my courses:", error);
      }
    };

    fetchCourses();

    if (activeTab === 'myCourses' || activeTab === 'forums') {
      fetchMyCourses();
    }
  }, [activeTab, userEmail]);

  // Fetch threads for selected course
  useEffect(() => {
    if (selectedCourse) {
      const fetchThreads = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/forums/${selectedCourse._id}/threads`
          );
          setThreads(response.data);
        } catch (error) {
          console.error("Error fetching forum threads:", error);
        }
      };
      fetchThreads();
    }
  }, [selectedCourse]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student-dashboard/forums/${selectedCourse._id}/threads`,
        {
          userName: userName, // Use userName from state
          message: newMessage,
        }
      );
      setThreads([...threads, response.data]); // Append the new message to the thread
      setNewMessage(''); // Clear the message input
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'allCourses':
        return (
          <div className="row g-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="col-md-6 col-lg-3"
                onClick={() => navigate(`/course/${course._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 shadow-sm border-0" style={{ width: '250px', height: '350px' }}>
                  <img
                    src={course.imageUrl || "vite.svg"}
                    alt="Course Thumbnail"
                    className="card-img-top"
                    style={{
                      height: '150px',
                      width: '100%',
                      objectFit: 'contain',
                      padding: '2px 5px',
                      borderRadius: '8px',
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{course.title}</h5>
                    <p className="card-text text-muted" style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'myCourses':
        return (
          <div className="row g-4">
            {myCourses.map((course) => (
              <div
                key={course._id}
                className="col-md-6 col-lg-3"
                onClick={() => navigate(`/my-courses/${course._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 shadow-sm border-0" style={{ width: '250px', height: '350px' }}>
                  <img
                    src={course.imageUrl || "vite.svg"}
                    alt="Course Thumbnail"
                    className="card-img-top"
                    style={{
                      height: '150px',
                      width: '100%',
                      objectFit: 'contain',
                      padding: '2px 5px',
                      borderRadius: '8px',
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{course.title}</h5>
                    <p className="card-text text-muted" style={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {course.description}
                    </p>
                    <div className="progress mt-2">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${course.completionPercentage}%` }}
                        aria-valuenow={course.completionPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {course.completionPercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'forums':
        return (
          <div>
            <h4>Select a Course</h4>
            <select onChange={(e) => handleCourseSelect(myCourses.find(course => course._id === e.target.value))}>
              <option value="">Select a course</option>
              {myCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>

            {selectedCourse && (
              <>
                <h5 className="mt-4">Discussion Thread for {selectedCourse.title}</h5>
                <div className="border p-3 rounded mb-4">
                  {threads.map((thread, index) => (
                    <div key={index} className="mb-3">
                      <strong>{thread.userName}</strong>: {thread.message} <hr />
                    </div>
                  ))}
                </div>
                
                <textarea
                  className="form-control mb-3"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handlePostMessage}>
                  Post Message
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <HeaderStudent onLogout={onLogout} />
      <div className="container mt-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'allCourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('allCourses')}
            >
              All Courses
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'myCourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('myCourses')}
            >
              My Courses
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'forums' ? 'active' : ''}`}
              onClick={() => setActiveTab('forums')}
            >
              Discussion Forums
            </button>
          </li>
        </ul>

        <div className="mt-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
