import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderStudent from '../Components/HeaderStudent';

const StudentProfile = ({onLogout}) => {
  const [student, setStudent] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null); // State for the new image file
  const email = localStorage.getItem('userEmail'); // Get the student's email from localStorage

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student/${email}`, {
          headers: {
            'x-auth-token': localStorage.getItem('studentToken')
          }
        });
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [email]);

  const handleInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSave = async () => {
    try {
      let updatedStudent = { ...student };

      if (newImage) {
        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('email', email);

        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload-profile-image-user`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': localStorage.getItem('studentToken'),
            },
          }
        );
        
        updatedStudent.imageUrl = response.data.imageUrl;
      }

      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/student/${email}`, updatedStudent, {
        headers: {
          'x-auth-token': localStorage.getItem('studentToken')
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
    <>
    <HeaderStudent onLogout={onLogout} />
    <div className="container p-5">
      <h2 className="text-primary mb-4">Student Profile</h2>
      <div className="card p-4 shadow">
        <div className="text-center mb-3">
          <img
            src={student.imageUrl || "default-profile.png"}
            alt="Student"
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
                    value={student.name || ''}
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
                    value={student.username || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </td>
              </tr>

              <tr>
                <th className="align-middle font-weight-normal">Email</th>
                <td>
                  <input type="email" value={student.email || email} className="form-control" disabled />
                </td>
              </tr>

              <tr>
                <th className="align-middle font-weight-normal">LinkedIn URL</th>
                <td>
                  <input
                    type="text"
                    name="linkedinUrl"
                    value={student.linkedinUrl || ''}
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
                    value={student.githubUrl || ''}
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
                    value={student.phoneNumber || ''}
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
    </>
  );
};

export default StudentProfile;
