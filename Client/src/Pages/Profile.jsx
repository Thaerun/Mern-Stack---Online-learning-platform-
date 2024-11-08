import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Components/SideBar';

const Profile = ({ onLogout }) => {
  const [instructor, setInstructor] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null); // State for the new image file
  const email = localStorage.getItem('instructorEmail');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructor/${email}`, {
          headers: {
            'x-auth-token': localStorage.getItem('instructorToken')
          }
        });
        setInstructor(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [email]);

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

  const handleInputChange = (e) => {
    setInstructor({ ...instructor, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSave = async () => {
    try {
      let updatedInstructor = { ...instructor };

      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('email', email);

        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload-profile-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
                     'x-auth-token': localStorage.getItem('instructorToken'),
           },
        });
        updatedInstructor.imageUrl = response.data.imageUrl;
      }

      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/instructor/${email}`, updatedInstructor, {
        headers: {
          'x-auth-token': localStorage.getItem('instructorToken')
        }
      });

      setIsEditing(false);
      setNewImage(null);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="flex-grow-1 p-5"
        style={{
          marginLeft: isSidebarOpen ? '250px' : '70px',
          transition: 'margin-left 0.3s',
        }}
      >
        <h2 className="text-primary mb-4">Instructor Profile</h2>
        <div className="card p-4 shadow">
          <div className="text-center mb-3">
            <img
              src={instructor.imageUrl || "default-profile.png"}
              alt="Instructor"
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
            />
            {isEditing && (
              <div className="mt-2">
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th className="align-middle font-weight-normal">Name</th>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={instructor.name || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>

                <tr>
                  <th className="align-middle font-weight-normal">Username</th>
                  <td>
                    <input
                      type="text"
                      name="username"
                      value={instructor.username || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>

                <tr>
                  <th className="align-middle font-weight-normal">Email</th>
                  <td>
                    <input type="email" value={instructor.email || ''} className="form-control" disabled />
                  </td>
                </tr>

                <tr>
                  <th className="align-middle font-weight-normal">LinkedIn URL</th>
                  <td>
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={instructor.linkedinUrl || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>

                <tr>
                  <th className="align-middle font-weight-normal">GitHub URL</th>
                  <td>
                    <input
                      type="text"
                      name="githubUrl"
                      value={instructor.githubUrl || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>

                <tr>
                  <th className="align-middle font-weight-bold">Phone Number</th>
                  <td>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={instructor.phoneNumber || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end">
            {isEditing ? (
              <button className="btn btn-success" onClick={handleSave}>Save</button>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
