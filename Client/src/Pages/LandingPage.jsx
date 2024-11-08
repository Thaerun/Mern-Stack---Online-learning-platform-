import React from 'react';
import { FaUsers, FaAward, FaStar, FaChevronRight } from 'react-icons/fa';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const featuredCourses = [
    {
      title: "JavaScript for Beginners",
      instructor: "Sarah Johnson",
      rating: 4.5,
    },
    {
      title: "Mastering Python",
      instructor: "Michael Lee",
      rating: 4.7,
    },
    {
      title: "Advanced Web Design",
      instructor: "Emma Wilson",
      rating: 4.3,
    },
  ];

  const studentFeedback = [
    {
      name: "Alice Brown",
      courseTitle: "JavaScript for Beginners",
      feedback:
        "An excellent course that made learning JavaScript so much easier! The instructor explained everything clearly.",
    },
    {
      name: "John Smith",
      courseTitle: "Mastering Python",
      feedback:
        "Loved the depth of this course. I feel confident working with Python now. Great experience!",
    },
    {
      name: "Linda Thompson",
      courseTitle: "Advanced Web Design",
      feedback:
        "The projects in this course were fantastic! The instructor's approach was practical and easy to follow.",
    },
  ];

  const topCategories = [
    "Web Development",
    "Data Science",
    "Business",
    "Design",
    "Marketing",
    "IT and Software",
  ];

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
                  <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/instructor-auth')}>Become an Instructor</button>
                </div>
              </div>
              <div className="col-lg-6 mt-4 mt-lg-0">
                <img src="hero image.jpg" alt="Hero" className="img-fluid rounded-3" width="450" height="450" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4">Featured Courses</h2>
            <div className="row g-4">
              {featuredCourses.map((course, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    {/* <img src="/placeholder.svg" className="card-img-top" alt={`Course ${index + 1}`} /> */}
                    <div className="card-body">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text text-muted">{course.instructor}</p>
                      <div className="d-flex align-items-center mb-3">
                        {[...Array(Math.floor(course.rating))].map((_, index) => (
                          <FaStar key={index} className="text-warning me-1" />
                        ))}
                        <FaStar className="text-muted me-1" />
                        <span className="text-muted">({course.rating.toFixed(1)})</span>
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
              {topCategories.map((category) => (
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
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/instructor-auth')}>Start Teaching Today</button>
              </div>
              <div className="col-lg-4 mt-4 mt-lg-0">
                <img src="instructor.jpg" alt="Instructor" className="img-fluid rounded-3" width="400" height="400" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="display-5 fw-bold mb-4 text-center">What Our Students Say</h2>
            <div className="row g-4">
              {studentFeedback.map((feedback, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* <img src="/placeholder.svg" alt={`Student ${index + 1}`} className="rounded-circle me-3" width="40" height="40" /> */}
                        <div>
                          <h5 className="card-title mb-0">{feedback.name}</h5>
                          <p className="card-text text-muted">{feedback.courseTitle}</p>
                        </div>
                      </div>
                      <p className="card-text">"{feedback.feedback}"</p>
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
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')} >Sign Up Now</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
