import React, { useState, useEffect } from 'react';
import './Profile.css';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import { FaEdit } from "react-icons/fa";
import useAuth from '../../Auth/useAuth.js';

const Profile = () => {
  // State to store profile data
  const [profileData, setProfileData] = useState({
    name: '',
    ID_Role: '',
    email: '',
    password: '',
    user_image: '',
    direction: '',
    telephone_number: '',
    card_holder:'',
    card_number: '',
    expiration_date: '',
    cvv: '',
    registration_date: '',
    user_state: '',
    last_login: ''
  });

  // State to handle loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null); // State to handle new image

  // State to handle password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {userData}= useAuth();

  // API call to fetch profile data
  useEffect(() => {
    const id_user = userData.id_user; // Specific user ID

    ecommerce_fetch(`${baseUrl}/users.php?id_user=${id_user}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        return response.json();
      })
      .then((data) => {
        if (data.data.length > 0) {
          const user = data.data[0];
          setProfileData({
            name: user.Name || '',
            ID_Role: user.ID_Role || '',
            email: user.Email || '',
            password: user.Password || '',
            direction: user.Direction || '',
            telephone_number: user.Telephone_Number || '',
            card_holder: user.Card_Holder || '',
            card_number: user.Card_Number || '',
            expiration_date: user.Expiration_Date || '',
            cvv: user.CVV || '',
            registration_date: user.Registration_Date || '',
            user_state: user.User_State || '',
            last_login: user.Last_Login || '',
            user_image: user.User_Image || 'https://via.placeholder.com/150' // Default profile image
          });
          setLoading(false);
        } else {
          setError('No users found');
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        console.error('Fetch error:', err); // Log error to console
        setLoading(false);
      });
  }, []);

  // Display a loading state or an error if it occurs
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Function to handle editing
  const handleEdit = () => {
    if (isEditing) {
      const confirmExit = window.confirm('You have unsaved changes. Are you sure you want to exit editing?');
      if (!confirmExit) return;
    }
    setIsEditing(!isEditing);
  };

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Create a preview URL for the image
        setProfileData((prevState) => ({
          ...prevState,
          user_image: reader.result // Store base64 image in profileData
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to update user data
  const handleUpdate = () => {
    // Prepare updated data, sending only fields that have values
    const updatedData = {
      id_user: 140, // Assuming 140 is the current user's ID
    };

    Object.keys(profileData).forEach((key) => {
      // Send field as null only if needed, otherwise send empty string
      updatedData[key] = profileData[key] !== '' ? profileData[key] : null;
    });

    console.log('Updating user with data:', updatedData); // Log the updated data being sent

    fetch(`${baseUrl}/users.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then(response => {
        console.log('Response:', response); // Log the response object
        if (!response.ok) {
          throw new Error('Failed to update user data');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message); // Display success message
        setIsEditing(false); // Exit editing mode
      })
      .catch(err => {
        alert(err.message); // Display error message
        console.error('Error during update:', err); // Log error to console
        // Keep editing mode enabled for further corrections
      });
  };

  // Function to handle password change
  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword) {
      alert('Please fill in both the old and new password fields.');
      return;
    }

    const passwordData = {
      email: profileData.email,
      old_password: oldPassword,
      new_password: newPassword
    };

    console.log('Changing password with data:', passwordData); // Log the password change data

    fetch(`${baseUrl}/users.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    })
      .then(response => {
        console.log('Response:', response); // Log the response object
        if (!response.ok) {
          throw new Error('Failed to change password');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message); // Display success message
        setOldPassword('');
        setNewPassword('');
      })
      .catch(err => {
        alert(err.message); // Display error message
        console.error('Error during password change:', err); // Log error to console
      });
  };

  // Render the profile with the retrieved data
  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <img className="profile-image" src={newImage || profileData.user_image} alt="Profile" />
        {isEditing && (
          <div className="image-upload">
            <label>
              Upload New Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
        )}
      </div>
      <h1>
        {profileData.name || 'Name not available'}
        {isEditing && (
          <input
            type="text"
            placeholder="Edit Name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
        )}
        <FaEdit 
          onClick={handleEdit} 
          style={{ cursor: 'pointer', marginLeft: '10px' }} 
        />
      </h1>
      <p><strong>Role:</strong> {profileData.ID_Role}</p>

      {/* Section for Personal Data and Card Data */}
      <div className="profile-info">
        <div className="profile-section">
          <h2 className="section-title">Personal Data</h2>
          <div className="profile-info-item">
            <p><strong>Email:</strong> {profileData.email}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Phone:</strong> {profileData.telephone_number}</p>
            {isEditing && (
              <input
                type="tel"
                placeholder="Edit Phone"
                value={profileData.telephone_number}
                onChange={(e) => setProfileData({ ...profileData, telephone_number: e.target.value })}
              />
            )}
          </div>
          <div className="profile-info-item">
            <p><strong>Address:</strong> {profileData.direction}</p>
            {isEditing && (
              <input
                type="text"
                placeholder="Edit Address"
                value={profileData.direction}
                onChange={(e) => setProfileData({ ...profileData, direction: e.target.value })}
              />
            )}
          </div>
          <div className="profile-info-item">
            <p><strong>Password:</strong> {'***'}</p>
            {isEditing && (
              <div className="password-change">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={handlePasswordChange}>Change Password</button>
              </div>
            )}
          </div>
        </div>
        <div className="profile-section">
          <h2 className="section-title">Card Data</h2>
          <div className="profile-info-item">
            <p><strong>Card Holder:</strong> {profileData.card_holder}</p>
            {isEditing && (
              <input
                type="text"
                placeholder="Edit Card Holder"
                value={profileData.card_holder}
                onChange={(e) => setProfileData({ ...profileData, card_holder: e.target.value })}
              />
            )}
          </div>
          <div className="profile-info-item">
            <p><strong>Card Number:</strong> {profileData.card_number}</p>
            {isEditing && (
              <input
                type="text"
                placeholder="Edit Card Number"
                value={profileData.card_number}
                onChange={(e) => setProfileData({ ...profileData, card_number: e.target.value })}
              />
            )}
          </div>
          <div className="profile-info-item">
            <p><strong>Expiration Date:</strong> {profileData.expiration_date}</p>
            {isEditing && (
              <input
                type="date"
                value={profileData.expiration_date}
                onChange={(e) => setProfileData({ ...profileData, expiration_date: e.target.value })}
              />
            )}
          </div>
          <div className="profile-info-item">
            <p><strong>CVV:</strong> {profileData.cvv}</p>
            {isEditing && (
              <input
                type="text"
                placeholder="Edit CVV"
                value={profileData.cvv}
                onChange={(e) => setProfileData({ ...profileData, cvv: e.target.value })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Button to submit updates */}
      {isEditing && (
        <button onClick={handleUpdate}>Save Changes</button>
      )}

      {/* Section for Other Data */}
      <div className="profile-info other-data">
        <h2 className="section-title">Other Data</h2>
        <div className="profile-info-item">
          <p><strong>Registration Date:</strong> {profileData.registration_date}</p>
        </div>
        <div className="profile-info-item">
          <p><strong>Status:</strong> {profileData.user_state}</p>
        </div>
        <div className="profile-info-item">
          <p><strong>Last Login:</strong> {profileData.last_login}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
