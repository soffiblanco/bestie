import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './ResetPassword.css';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const location = useLocation();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
};


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    setLoading(true);

    const data = new FormData();
    data.append('action','reset_password');
    data.append('email', email);
    data.append('new_password', newPassword);

    axiosInstance.post('/reset_password.php', data)
      .then(response => {

        console.log('Success response:', response);

        if (response.status === 200) {
          toast.success(response.data.message);

          setNewPassword('');
          setConfirmPassword('');
         
          setTimeout(() => {
            navigate('/login');
        }, 2000);
          
        } else {
       
        console.warn('Unexpected response status:', response.status);
      }
      })
      .catch(error => {
        console.error('Error during password reset:', error); // Agrega esto
      console.log('Error response data:', error.response?.data); // Agrega esto
        toast.error(error.response?.data?.message || 'Error en la solicitud.');
      })
      .finally(() => {
        setLoading(false);
      });

  };

  return (
    <>
    <ToastContainer position="top-right" />
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly 
          />
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
           <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
        <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Reset Password'}
        </button>
        <button type="button" onClick={handleBackToLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Back to login'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}

export default ResetPassword;
