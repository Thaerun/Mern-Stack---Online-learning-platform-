// Blog.js
import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Blog() {
  const blogPosts = [
    {
      title: "5 Tips for Successful Online Teaching",
      author: "John Doe",
      date: "November 1, 2024",
      summary: "Discover key strategies for making online teaching more effective, engaging, and enjoyable for your students.",
    },
    {
      title: "How to Create Engaging Course Content",
      author: "Jane Smith",
      date: "October 28, 2024",
      summary: "Learn tips and tricks for creating content that keeps your students motivated and interested.",
    },
    {
      title: "Best Practices for Assessing Student Progress",
      author: "Emily Brown",
      date: "October 20, 2024",
      summary: "Explore various assessment techniques to gauge student understanding and promote continuous improvement.",
    },
    {
      title: "Using Technology to Enhance Learning",
      author: "Michael Lee",
      date: "October 15, 2024",
      summary: "Understand how you can leverage modern tools and platforms to create a dynamic online learning experience.",
    }
  ];

  return (
    <div>
      <Header />

      <div className="container mt-5 mb-5">
        <h2 className="text-center mb-4">Learn Hub Blog</h2>

        {/* Featured Post */}
        <div className="card mb-5 shadow" style={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
          <div className="card-body text-center">
            <h3 className="card-title">Welcome to Our Blog</h3>
            <p className="card-text">
              Stay up-to-date with the latest trends in online education, get insights from experienced educators, and find practical tips for creating better learning experiences on Learn Hub!
            </p>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="row">
          {blogPosts.map((post, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card h-100 shadow" style={{ borderRadius: '10px' }}>
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    By {post.author} | {post.date}
                  </p>
                  <p className="card-text">{post.summary}</p>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-primary w-100" style={{ borderRadius: '5px' }}>Read More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Blog;
