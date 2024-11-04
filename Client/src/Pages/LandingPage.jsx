import React from 'react';
import {  FaUsers, FaAward, FaStar, FaChevronRight } from 'react-icons/fa';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
export default function LandingPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 fw-bold mb-3">Learn Without Limits</h1>
                <p className="lead mb-4">Start, switch, or advance your career with thousands of courses from expert instructors.</p>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button className="btn btn-primary btn-lg">Explore Courses</button>
                  <button className="btn btn-outline-primary btn-lg">Become an Instructor</button>
                </div>
              </div>
              <div className="col-lg-6 mt-4 mt-lg-0">
                <img src="/placeholder.svg" alt="Hero" className="img-fluid rounded-3" width="550" height="550" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4">Featured Courses</h2>
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <img src="/placeholder.svg" className="card-img-top" alt={`Course ${i}`} />
                    <div className="card-body">
                      <h5 className="card-title">Course Title {i}</h5>
                      <p className="card-text text-muted">Instructor Name</p>
                      <div className="d-flex align-items-center mb-3">
                        {[...Array(4)].map((_, index) => (
                          <FaStar key={index} className="text-warning me-1" />
                        ))}
                        <FaStar className="text-muted me-1" />
                        <span className="text-muted">(4.0)</span>
                      </div>
                      <button className="btn btn-primary w-100">Enroll Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4">Top Categories</h2>
            <div className="row g-4">
              {["Web Development", "Data Science", "Business", "Design", "Marketing", "IT and Software"].map((category) => (
                <div key={category} className="col-md-6 col-lg-4">
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">{category}</h5>
                      <FaChevronRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4">Become an Instructor</h2>
            <div className="row align-items-center">
              <div className="col-lg-8">
                <p className="lead mb-4">
                  Join our community of expert instructors and share your knowledge with students worldwide. Create
                  engaging courses, set your prices, and earn money while making a difference.
                </p>
                <button className="btn btn-primary btn-lg">Start Teaching Today</button>
              </div>
              <div className="col-lg-4 mt-4 mt-lg-0">
                <img src="/placeholder.svg" alt="Instructor" className="img-fluid rounded-3" width="400" height="400" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4 text-center">What Our Students Say</h2>
            <div className="row g-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <img src="/placeholder.svg" alt={`Student ${i}`} className="rounded-circle me-3" width="40" height="40" />
                        <div>
                          <h5 className="card-title mb-0">Student Name {i}</h5>
                          <p className="card-text text-muted">Course Title</p>
                        </div>
                      </div>
                      <p className="card-text">
                        "This course exceeded my expectations. The instructor was knowledgeable and the content was
                        well-structured. I feel much more confident in my skills now."
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container text-center">
            <h2 className="display-5 fw-bold mb-3">Start Learning Today</h2>
            <p className="lead mb-4">
              Join millions of learners and start your journey to success. Unlimited access to thousands of courses
              for one low price.
            </p>
            <button className="btn btn-primary btn-lg">Sign Up Now</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}