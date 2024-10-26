import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCcVisa, FaImage,FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from '../../services/axiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import cardValidator from 'card-validator';
import { useNavigate } from 'react-router-dom';

import './Add.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    direction: '',
    telephone_number: '',
    user_image: null,
    card_holder: '',
    card_number: '',
    expiration_date: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [passwordError, setPasswordError] = useState(''); // State to track password errors
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Function to handle image file input
    const handleImageChange = (e) => {
        setFormData({ ...formData, user_image: e.target.files[0] });
    };

    const validateDate=(e) => {
        if(!isNaN(new Date(e.target.value))){
            return e.preventDefault();
        } 
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = `/users.php`;

    const data = new FormData();
    data.append('action', 'register');
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('direction', formData.direction);
    data.append('telephone_number', formData.telephone_number);
    data.append('card_holder', formData.card_holder);
    data.append('card_number', formData.card_number);
    data.append('expiration_date', selectedDate ? selectedDate.toISOString().split('T')[0] : '');
    
    if (selectedDate) {
      const expirationMonth = ('0' + (selectedDate.getMonth() + 1)).slice(-2); // Mes en dos dígitos
      const expirationYear = selectedDate.getFullYear();
      data.append('expiration_date', `${expirationMonth}/${expirationYear}`); // Cambiado a MM/YYYY
  } else {
      data.append('expiration_date', '');
  }
    data.append('cvv', formData.cvv);

    if (formData.user_image) {
        data.append('user_image', formData.user_image);  // Append file to FormData
    }

    if ( formData.password !== formData.confirm_password) {
      setPasswordError('Passwords do not match');
      return;
  }

  setPasswordError(''); 


  if (formData.card_number) {
      const cardValidation = cardValidator.number(formData.card_number);
      if (!cardValidation.isValid) {
          toast.error('Invalid credit card number');
          return;
      }
  }


  for (let [key, value] of data.entries()) {
    console.log(`${key}: ${value}`);
}


    setLoading(true);

    axiosInstance.post(endpoint, data, {
      headers: {
          'Content-Type': 'multipart/form-data',  // Ensure correct header for file upload
      }
  })
  .then(response => {
      if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
              navigate('/users');
          }, 2000);

              setFormData({
                  username: '',
                  name: '',
                  email: '',
                  password: '',
                  confirm_password: '',
                  direction: '',
                  telephone_number: '',
                  card_holder: '',
                  card_number: '',
                  expiration_date: '',
                  cvv: '',
                  user_image: null
              });
              setSelectedDate(null);
          
      }
  })
  .catch(error => {
      toast.error(error.response?.data?.message || 'Request error.');
  })
  .finally(() => {
      setLoading(false); // End loading
  });
};

  return (
   <>
    <ToastContainer position="top-right" />
    <div className="add-user-container">
      <h1 className="title">Add User</h1>
      <form onSubmit={handleSubmit}>
      <div className="input-box">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                />
                <FaUser className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                />
                <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    required
                />
                <FaLock className="icon" />
                <span className="eye-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>

            <div className="input-box">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password || ''}
                    onChange={handleChange}
                    required
                />
                <FaLock className="icon" />
                <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>

            {passwordError && (
                <p style={{ color: 'red', fontSize: '0.9rem' }}>{passwordError}</p>
            )}

            <div className="input-box">
                <input
                    type="text"
                    name="direction"
                    placeholder="Address"
                    value={formData.direction || ''}
                    onChange={handleChange}
                />
                <FaMapMarkerAlt className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="number"
                    name="telephone_number"
                    placeholder="Phone Number"
                    value={formData.telephone_number || ''}
                    onChange={handleChange}
                />
                <FaPhone className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="file"
                    name="user_image"
                    placeholder="Profile Image"
                    onChange={handleImageChange}
                    className="file-input"
                />
                <label htmlFor="user_image" className="floating-label">
                    User Image
                </label>
                <FaImage className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="text"
                    name="card_holder"
                    placeholder="Card Holder"
                    value={formData.card_holder || ''}
                    onChange={handleChange}
                />
                <FaCcVisa className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="number"
                    name="card_number"
                    placeholder="Card Number"
                    value={formData.card_number || ''}
                    onChange={handleChange}
                />
                <FaCcVisa className="icon" />
            </div>

            <div className="input-box">
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MM-yyyy"
                    showMonthYearPicker
                    placeholderText="Select Expiration Date"
                    onKeyDown={validateDate}
                />
                <FaCcVisa className="icon" />
            </div>

            <div className="input-box">
                <input
                    type="number"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv || ''}
                    onChange={handleChange}
                />
                <FaCcVisa className="icon" />
            </div>

            <button type="submit" disabled={loading}>
          
                {loading ? 'Loading...' : 'Add User'}
            </button>
        </form>
    
    </div>
    </>
  );
};

export default AddUser;