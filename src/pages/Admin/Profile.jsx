import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  // State to store profile data
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    user_image: '',
    direction: '',
    telephone_number: '',
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

  // API call to fetch profile data
  useEffect(() => {
    const id_user = 95; // Specific user ID

    fetch(`http://localhost/apis/users.php?id_user=${id_user}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Received data:', data);  // Check what data is received here

        if (data.data.length > 0) {
          const user = data.data[0];

          // Update text data first
          setProfileData((prevState) => ({
            ...prevState,
            name: user.Name || 'Name not available',
            role: user.Role || 'Role not available',
            email: user.Email || 'Email not available',
            password: user.Password || 'Password not available',
            direction: user.Direction || 'Address not available',
            telephone_number: user.Telephone_Number || 'Phone number not available',
            card_number: user.Card_Number || 'Card number not available',
            expiration_date: user.Expiration_Date || 'Expiration date not available',
            cvv: user.CVV || 'CVV not available',
            registration_date: user.Registration_Date || 'Registration date not available',
            user_state: user.User_State || 'State not available',
            last_login: user.Last_Login || 'Last login not available',
            user_image: user.User_Image || 'https://via.placeholder.com/150' // Default profile image
          }));

          setLoading(false); // Set loading to false only after the entire process is complete
        } else {
          setError('No users found');
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
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

  // Render the profile with the retrieved data
  return (
    <div className="profile-container">
      <img className="profile-image" src={profileData.user_image} alt="Profile" />
      <h1>{profileData.name}</h1>
      <p><strong>Role:</strong> {profileData.role}</p>
  
      {/* Section for Personal Data and Card Data */}
      <div className="profile-info">
        <div className="profile-section">
          <h2 className="section-title">Personal Data</h2>
          <div className="profile-info-item">
            <p><strong>Email:</strong> {profileData.email}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Phone:</strong> {profileData.telephone_number}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Address:</strong> {profileData.direction}</p>
          </div>
        </div>
        <div className="profile-section">
          <h2 className="section-title">Card Data</h2>
          <div className="profile-info-item">
            <p><strong>Card Number:</strong> {profileData.card_number}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>Expiration Date:</strong> {profileData.expiration_date}</p>
          </div>
          <div className="profile-info-item">
            <p><strong>CVV:</strong> {profileData.cvv}</p>
          </div>
        </div>
      </div>
  
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
