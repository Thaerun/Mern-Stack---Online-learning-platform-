import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
export default function Footer(){
  const navigate = useNavigate();


    return (
      <footer className="bg-light py-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-md-6 col-lg-3">
            <h4 className="fw-bold mb-3">About Us</h4>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted"onClick={() => navigate('/careers')}>Careers</a></li>
              <li><a href="#" className="text-decoration-none text-muted"onClick={() => navigate('/blog')}>Blog</a></li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3">
            <h4 className="fw-bold mb-3">Teach</h4>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted" onClick={() => navigate('/instructor-auth')}>Become an Instructor</a></li>
              <li><a href="#" className="text-decoration-none text-muted" onClick={() => navigate('/TeacherGuidelines')}>Teacher Guidelines</a></li>
            </ul>
          </div>
          <div className="col-md-6 col-lg-3">
            <h4 className="fw-bold mb-3">Connect</h4>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted">Help Center</a></li>
              <li><a href="#"  className="text-decoration-none text-muted" onClick={() => navigate('/contact-us')}>Contact Us</a></li>
              
           <li></li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <ul className="list-inline text-md-end mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-muted"><FaFacebookF /></a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-muted"><FaInstagram /></a>
              </li>
              <li className="list-inline-item ms-3">
                <a href="#" className="text-muted"><FaTwitter /></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
        {/* Dayanithi */}
      </footer>
    )
}