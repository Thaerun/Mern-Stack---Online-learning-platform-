import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = ({ onLogout }) => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses`);
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this course?');
        if (confirmDelete) {
            try {
                await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/courses/${id}`);
                setCourses(courses.filter(course => course._id !== id));
                alert('Course deleted successfully!');
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handleEdit = (course) => {
        navigate('/edit-course', { state: { course } });
    };

    return (
        <div className="d-flex min-vh-100 bg-light">
            {/* Sidebar */}
            <div className="bg-primary text-white p-4" style={{ width: '250px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
                <h2 className="text-center mb-4">Dashboard</h2>
                <ul className="nav flex-column">
                    <li className="nav-item mb-3">
                        <a href="/instructor-dashboard" className="nav-link text-white">My Courses</a>
                    </li>
                    <li className="nav-item mb-3">
                        <a href="/create-course" className="nav-link text-white">Create a Course</a>
                    </li>
                    <li className="nav-item">
                        <a href="/earnings" className="nav-link text-white">Earnings</a>
                    </li>
                </ul>
                <button className="btn btn-primary" onClick={onLogout}>Logout</button>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-5" style={{ marginLeft: '250px' }}>
                <h2 className="text-primary mb-4">My Courses</h2>
                <div className="row g-4">
                    {courses.map((course) => (
                        <div key={course._id} className="col-md-6 col-lg-3">
                            <div className="card h-100 shadow-sm border-0">
                                <img src={course.imageUrl || "vite.svg"} alt="Course Thumbnail" className="card-img-top" style={{ height: '150px', objectFit: 'contain' }} />
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{course.title}</h5>
                                    <p className="card-text text-muted">{course.description}</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(course)}>Edit</button>
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
