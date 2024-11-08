import React, { useState, useEffect } from 'react';
import { FaSearch, FaBook, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';

export default function HeaderStudent({ onLogout, userEmail }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const userEmail123 = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/courses`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('studentToken')
                      }
                });
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/${userEmail123}`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('studentToken')
                      }
                });
                setPurchasedCourses(response.data.purchasedCourses);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchCourses();
        fetchUserData();
    }, [userEmail]);

    const handleSearchChange = (e) => {
        setQuery(e.target.value);
        
        if (e.target.value.length > 1) {
            const filteredResults = courses.filter(course =>
                course.title.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setSearchResults(filteredResults);
        } else {
            setSearchResults([]);
        }
    };

    const handleCourseClick = (course) => {
        const isPurchased = purchasedCourses.includes(course._id);
        const redirectPath = isPurchased
            ? `/my-courses/${course._id}`
            : `/course/${course._id}`;
        
        navigate(redirectPath);
    };

    return (
        <header className="sticky-top bg-white border-bottom">
            <nav className="navbar navbar-expand-lg navbar-light py-2 px-3">
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <FaBook className="me-2" />
                    <span className="fw-bold">LearnHub</span>
                </a>
                
                <div className="ms-auto d-flex align-items-center">
                    <div className="search-wrapper d-none d-lg-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" style={{ maxWidth: '400px', position: 'relative' }}>
                        <div className="input-group w-100">
                            <span className="input-group-text bg-white border-end-0">
                                <FaSearch className="text-muted" />
                            </span>
                            <input
                                className="form-control border-start-0"
                                type="search"
                                placeholder="Search for courses..."
                                aria-label="Search"
                                value={query}
                                onChange={handleSearchChange}
                            />
                            {query && searchResults.length > 0 && (
                                <div className="dropdown-menu show w-100" style={{ position: 'absolute', top: '100%', zIndex: 1000 }}>
                                    {searchResults.map((course) => (
                                        <button
                                            key={course._id}
                                            className="dropdown-item text-truncate"
                                            onClick={() => handleCourseClick(course)}
                                        >
                                            {course.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Burger Menu with Custom Dropdown */}
                    <div className="d-lg-none position-relative">
                        <button className="btn p-0 m-0 border-0" onClick={() => setShowDropdown(!showDropdown)}>
                            <FaBars size={24} />
                        </button>

                        <Dropdown.Menu show={showDropdown} align="end" className="position-absolute end-0 mt-2">
                            <Dropdown.Item onClick={() => navigate('/student-profile')}>
                                <FaUser className="me-2" /> Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={onLogout}>
                                <FaSignOutAlt className="me-2" /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </div>

                    {/* Profile and Logout Buttons for large screens */}
                    <div className="d-none d-lg-flex align-items-center">
                        <button className="btn btn-outline-primary me-3" onClick={() => navigate('/student-profile')}>
                            <FaUser className="me-1" /> Profile
                        </button>
                        <button className="btn btn-outline-danger" onClick={onLogout}>
                            <FaSignOutAlt className="me-1" /> Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}
