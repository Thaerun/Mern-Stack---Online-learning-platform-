import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/SideBar';

const InstructorDashboard = ({ onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const instructorEmail = localStorage.getItem('instructorEmail');
                const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses`, {
                    instructorEmail: instructorEmail
                }, {
                    headers: {
                        'x-auth-token': localStorage.getItem('instructorToken')
                    }
                });
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    // Auto-collapse sidebar on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Check initial width

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this course?');
        if (confirmDelete) {
            try {
                await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses/${id}`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('instructorToken')
                    }
                });
                setCourses(courses.filter(course => course._id !== id));
                alert('Course deleted successfully!');
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handleEdit = (courseId) => {
        navigate(`/edit-course/${courseId}`);
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div
                className="flex-grow-1 p-5"
                style={{
                    marginLeft: isSidebarOpen ? '250px' : '70px', // Adjust dynamically based on sidebar width
                    transition: 'margin-left 0.3s',
                }}
            >
                <h2 className="text-primary mb-4">My Courses</h2>
                <div className="row g-4">
                    {courses.map((course) => (
                        <div key={course._id} className="col-md-6 col-lg-3">
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
                                        {course.description.slice(0, 100) + (course.description.length > 100 ? "..." : "")}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(course._id)}>Edit</button>
                                        <button className="btn btn-link text-danger btn-sm" onClick={() => handleDelete(course._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
