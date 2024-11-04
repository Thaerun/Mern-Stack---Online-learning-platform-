import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
export default function Footer(){
    return (
        <footer className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <h4 className="fw-bold mb-3">About Us</h4>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-muted">Our Story</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Careers</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Press</a></li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-3">
              <h4 className="fw-bold mb-3">Learn</h4>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-muted">All Courses</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Free Courses</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Blog</a></li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-3">
              <h4 className="fw-bold mb-3">Teach</h4>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-muted">Become an Instructor</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Teacher Guidelines</a></li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-3">
              <h4 className="fw-bold mb-3">Connect</h4>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-muted">Help Center</a></li>
                <li><a href="#" className="text-decoration-none text-muted">Contact Us</a></li>
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
      </footer>
    )
}