import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Profile.css';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import { FaEdit } from "react-icons/fa";
import {useAuth} from '../../Auth/AuthContext.js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cardValidator from 'card-validator';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditUser = () => {
  // State to store profile data
  const { userId } = useParams();
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

  const [editedData, setEditedData] = useState({
  });

  const [selectedExpirationDate, setSelectedExpirationDate] = useState(null);

  // Separate state to handle email editing
  const [editedEmail, setEditedEmail] = useState('');

  // State to handle loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States to handle updates
  const [isEditingGeneral, setIsEditingGeneral] = useState(false); // For general data
  const [isEditingEmail, setIsEditingEmail] = useState(false); // For email
  const [isEditingPassword, setIsEditingPassword] = useState(false); // For password

  const [newImage, setNewImage] = useState(null); // State to handle new image

  // State to handle password change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showoldPassword, setShowoldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [roles, setRoles] = useState([]);
  const [userStates, setUserStates] = useState([]);

 // State to handle email change
  const [emailToConfirm, setEmailToConfirm] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); 


  const {userData,logout}= useAuth();

  const toggleOldPasswordVisibility = () => {
    setShowoldPassword(!showoldPassword);
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
};


  // API call to fetch profile data
  useEffect(() => {


  const params = new URLSearchParams(location.search);
  const status = params.get('status');

  // Si status es "success", mostrar un toast de éxito
  if (status === 'success') {
    toast.success('User data updated successfully');
  }
 
    ecommerce_fetch(`${baseUrl}/users.php?id_user=${userId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching profile data');
        }
        return response.json();
      })
      .then((data) => {
        console.log("User data fetched:", data);
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
            card_number: user.Card_Number ? `**** **** **** ${user.Card_Number.slice(-4)}` : '',
            expiration_date: user.Expiration_Date ? '**/**' : '',
            cvv: user.CVV ? '***' : '',
            registration_date: user.Registration_Date || '',
            user_state: user.User_State || '',
            last_login: user.Last_Login || '',
            user_image: user.User_Image || 'https://via.placeholder.com/150' // Default profile image
          });


          if (user.Expiration_Date) {
            const [month, year] = user.Expiration_Date.split('-').map(Number);
            // Crear una fecha con el primer día del mes seleccionado
            const date = new Date(year, month - 1, 1);
            setSelectedExpirationDate(date);
          }

          
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

      // Fetch roles
      ecommerce_fetch(`${baseUrl}/roles.php`, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Roles fetched:", data);
        setRoles(data.roles); 
      })
      .catch((err) => {
        setError(err.message);
      });

      ecommerce_fetch(`${baseUrl}/user_state.php`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User states fetched:", data);
          if (data && data.states) {
            setUserStates(data.states);
          } else {
            throw new Error('Unexpected API response format');
          }
        })
        .catch((err) => {
          toast.error('Error fetching user states:', err);
        });


  }, []);

  // Function to handle general data edit toggle
      const handleEditToggle = () => {
        if (!isEditingGeneral) {
          const hasUnsavedChanges = Object.keys(editedData).some(key => {
            return editedData[key] !== undefined && editedData[key] !== profileData[key];
          });
          if (hasUnsavedChanges) {
            toast.warn('You have unsaved changes.');
          }  else{
            setEditedData({});}    
        }
        setIsEditingGeneral(!isEditingGeneral);
      };

  // Function to handle email edit toggle
  const handleEditEmailToggle = () => {
    if (isEditingEmail) {
      if (editedEmail && editedEmail !== profileData.email) {
        toast.warn('You didn`t save the email change.');
      }

      setEditedEmail('');
    }

    setIsEditingEmail(!isEditingEmail);
  };
 
  const validateDate=(e) => {
    if(!isNaN(new Date(e.target.value))){
        return e.preventDefault();
    } 
}

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

// Function to handle email confirmation
const handleEmailConfirm = () => {
  setLoading(true);

  const id_user = userData.id_user;
  const currentUrl = window.location.href;

  const emailData = {
    id_user,
    email: editedEmail,
    originUrl: currentUrl,
  };

  
  fetch(`${baseUrl}/change_email.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || 'Error');
        });
      }
      return response.json();
    })
    .then(() => {
      toast.info('A verification email was sent. Check your inbox to confirm the email change.');
    })
    .catch((err) => {
      toast.error(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
};

  // Function to update user data (without email change)
    const handleUpdateGeneralData = () => {
      setLoading(true);
    
      // Validación de número de tarjeta solo si se ha editado
      if (editedData.card_number) {
        const cardValidation = cardValidator.number(editedData.card_number);
        if (!cardValidation.isValid) {
          toast.error('Invalid card number. Please enter a valid card number.');
          setLoading(false);
          return;
        }
      }
    
      const { password, registration_date, user_state, last_login, ...otherProfileData } = profileData;
    
      // Combinar datos actuales con los editados
      const updatedData = {
        id_user: userId,
        ...otherProfileData,
        ...editedData,
      };
    
      if (isEditingGeneral && selectedExpirationDate) {
        const month = ('0' + (selectedExpirationDate.getMonth() + 1)).slice(-2);
        const year = selectedExpirationDate.getFullYear();
        updatedData.expiration_date = `${month}-${year}`;
      }
    
      console.log('Sending updatedData:', updatedData); 
    
      fetch(`${baseUrl}/users.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || 'Error updating user data');
            });
          }
          return response.json();
        })
        .then(data => {
          setProfileData((prevProfileData) => ({
            ...prevProfileData,
            ...editedData,
            expiration_date: updatedData.expiration_date,
          }));
          toast.success(data.message || 'Data updated successfully');
          setIsEditingGeneral(false);
        })
        .catch(err => {
          toast.error(err.message); // Mostrar mensaje de error
        })
        .finally(() => {
          setLoading(false);
        });
    };
    
  // Function to handle password change
  const handlePasswordChange = () => {

    setLoading(true);

    if (oldPassword === newPassword) {
      toast.error('The old and new password are the same');
      setLoading(false);
      return;
    }

    if (!oldPassword || !newPassword) {
      toast.warm('Please fill in both the old and new password fields.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      setLoading(false);
      return;
    }

    const passwordData = {
      email: profileData.email,
      old_password: oldPassword,
      new_password: newPassword,
      confirmPassword: confirmPassword
    };

    fetch(`${baseUrl}/users.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    })
    .then((response) => {
      // Siempre parseamos la respuesta como JSON
      return response.json();
    })
    .then((data) => {
      console.log('Response data:', data);

      if (data.message && data.message.toLowerCase().includes('successfully')) {
        
        toast.success(data.message || 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsEditingPassword(false);
      } else {
      
        toast.error(data.message || 'Failed to change password');
      }
    })
    .catch((err) => {
      toast.error(err.message || 'Failed to change password'); 
      console.error('Password change error:', err);
    })
    .finally(() => {
      setLoading(false);
    });

  };

  // Render the profile with the retrieved data
  return (
    <>
    <ToastContainer position="top-right" />
    <div className="profile-container">
      <div className="profile-image-container">
        <img className="profile-image" src={newImage || profileData.user_image} alt="Profile" />
        {isEditingGeneral && (
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
        {isEditingGeneral && (
          <input
            type="text"
            placeholder="Edit Name"
            value={editedData.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
          />
        )}
        <FaEdit 
          onClick={handleEditToggle}
          style={{ cursor: 'pointer', marginLeft: '10px' }} 
        />
      </h1>

      <p><strong>Role:</strong> {isEditingGeneral ? (
        <select
          value={editedData.ID_Role || profileData.ID_Role}
          onChange={(e) => setEditedData({ ...editedData, ID_Role: e.target.value })}
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.id_role} value={role.id_role}> 
              {role.role}
            </option>
          ))}
        </select>
      ) : (
        roles.find(role => role.id_role === profileData.ID_Role)?.role || profileData.ID_Role
      )}</p>


      <div className="profile-info">
      {/* Section for Email */}
        <div className="profile-section">
          <h2 className="section-title">Email</h2>
          <div className="profile-info-item">
          <p><strong>Email:</strong> {profileData.email}</p>
          {isEditingEmail ? (
                  <input
                    type="email"
                    placeholder="Edit Email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : null}
                  {isEditingEmail && (
                <button onClick={handleEmailConfirm} disabled={loading}>
                  {loading ? 'Sending...' : 'Confirm Email'}
                </button>
              )}
               <FaEdit 
                onClick= {handleEditEmailToggle}
                style={{ cursor: 'pointer', marginLeft: '10px' }} 
              />
          </div>
    </div>

   {/* Password Section */}
<div className="profile-section">
  <h2 className='section-title'>Password</h2>
  <div className="profile-info-item">
    <p><strong>Password:</strong> {'***'}</p>
    {isEditingPassword && (
      <div className="password-change">
        <div className="password-input-container">
          <input
            type={showoldPassword ? 'text' : 'password'}
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={toggleOldPasswordVisibility}>
            {showoldPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>   
        </div>

        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={handlePasswordChange} disabled={loading}>
          {loading ? 'Loading...' : 'Change Password'}
        </button>
      </div>     
    )}
    <FaEdit 
      onClick={() => setIsEditingPassword(!isEditingPassword)} 
      style={{ cursor: 'pointer', marginLeft: '10px' }} 
    />
  </div>
</div>


          {/* General Information Section */}
          <div className='profile-section'>
            <h2 className='section-title'>Personal Data</h2>
          <div className="profile-info-item">
            <p><strong>Phone:</strong> {profileData.telephone_number}</p>
            {isEditingGeneral ? (
              <input
                type="number"
                placeholder="Edit Phone"
                value={editedData.telephone_number}
                onChange={(e) => setEditedData({ ...editedData, telephone_number: e.target.value })}
              />
            ) : null}
         </div>
          <div className="profile-info-item">
            <p><strong>Address:</strong> {profileData.direction}</p>
            {isEditingGeneral ? (
              <input
                type="text"
                placeholder="Edit Address"
                value={editedData.direction}
                onChange={(e) => setEditedData({ ...editedData, direction: e.target.value })}
              />
            ) : null }
          </div>
          </div>


        <div className="profile-section">
          <h2 className="section-title">Card Data</h2>
          <div className="profile-info-item">
            <p><strong>Card Holder:</strong> {profileData.card_holder}</p>
            {isEditingGeneral ? (
              <input
                type="text"
                placeholder="Edit Card Holder"
                value={editedData.card_holder}
                onChange={(e) => setEditedData({ ...editedData, card_holder: e.target.value })}
              />
            ) : null }
          </div>
          <div className="profile-info-item">
            <p><strong>Card Number:</strong> {profileData.card_number}</p>
            {isEditingGeneral ? (
              <input
                type="number"
                placeholder="Edit Card Number"
                value={editedData.card_number}
                onChange={(e) => setEditedData({ ...editedData, card_number: e.target.value })}
              />
            ) : null}
          </div>
          <div className="profile-info-item">
          <p><strong>Expiration Date:</strong> {profileData.expiration_date}</p>
          {isEditingGeneral ? (
            <DatePicker
              selected={selectedExpirationDate}
              onChange={(date) => setSelectedExpirationDate(date)}
              dateFormat="MM-yyyy"
              showMonthYearPicker
              placeholderText="Select Expiration Date"
              className="date-picker-input"
            />
          ) : null}
        </div>
          <div className="profile-info-item">
            <p><strong>CVV:</strong> {profileData.cvv}</p>
            {isEditingGeneral ? (
              <input
                type="number"
                placeholder="Edit CVV"
                value={editedData.cvv}
                onChange={(e) => setEditedData({ ...editedData, cvv: e.target.value })}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Button to submit updates */}
      {isEditingGeneral && (
        <button onClick={handleUpdateGeneralData} disabled={loading}>
        {loading ? 'Loading...' : 'Save Changes'}
      </button>
  
      )}

      {/* Section for Other Data */}
      <div className="profile-info other-data">
        <h2 className="section-title">Other Data</h2>
        <div className="profile-info-item">
          <p><strong>Registration Date:</strong> {profileData.registration_date}</p>
        </div>
        <div className="profile-info-item">
        <p><strong>Status:</strong> {isEditingGeneral ? (
    <select
      value={editedData.user_state || profileData.user_state}
      onChange={(e) => setEditedData({ ...editedData, user_state: e.target.value })}
    >
      <option value="">Select Status</option>
      {Array.isArray(userStates) && userStates.length > 0 ? (
          userStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))
        ) : (
          <option value="" disabled>Loading...</option>
        )}
        </select>
      ) : (
        profileData.user_state
      )}
    </p>

        </div>
        <div className="profile-info-item">
          <p><strong>Last Login:</strong> {profileData.last_login}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditUser;