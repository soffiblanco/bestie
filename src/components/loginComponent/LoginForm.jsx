import React, { useState, useEffect} from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCcVisa, FaImage } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../services/axiosConfig.js';
import useAuth from '../../Auth/useAuth.js';

const LoginForm = () => {

    const {login}= useAuth();
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        direction: '',
        telephone_number: '',
        card_holder: '',
        card_number: '',
        expiration_date: '',
        cvv: '',
        user_image: null  // Ensure image is initialized as null
    });

    const [loading, setLoading] = useState(false); // Handle loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle image file input
    const handleImageChange = (e) => {
        setFormData({ ...formData, user_image: e.target.files[0] });
    };

    useEffect(() => {
        if (window.location.hash === '#verified') {
            toast.success('Your account has been verified successfully!');
            window.location.hash = '';
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const endpoint = `/users.php`;

        const data = new FormData();  // Use FormData to handle file uploads

        if (isLoginActive) {
            data.append('action', 'login');
            data.append('email', formData.email);
            data.append('password', formData.password);
        } else {
            data.append('action', 'register');
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('direction', formData.direction);
            data.append('telephone_number', formData.telephone_number);
            data.append('card_holder', formData.card_holder);
            data.append('card_number', formData.card_number);
            data.append('expiration_date', formData.expiration_date);
            data.append('cvv', formData.cvv);

            if (formData.user_image) {
                data.append('user_image', formData.user_image);  // Append file to FormData
            }
        }

        setLoading(true); // Start loading

        axiosInstance.post(endpoint, data, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Ensure correct header for file upload
            }
        })
        .then(response => {
            if (response.status === 200) {
                toast.success(response.data.message);
             
            if (isLoginActive && response.data.token) {
                login( response.data.token);
            }

                if (!isLoginActive) {
                    // Clear form data and navigate to login
                    setFormData({
                        username: '',
                        name: '',
                        email: '',
                        password: '',
                        direction: '',
                        telephone_number: '',
                        card_holder: '',
                        card_number: '',
                        expiration_date: '',
                        cvv: '',
                        user_image: null
                    });
                    setIsLoginActive(true);
                }
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
            <div className={`wrapper ${isLoginActive ? 'login-active' : 'register-active'}`}>
                <form onSubmit={handleSubmit}>
                    <h1>{isLoginActive ? 'Login' : 'Registration'}</h1>

                    {isLoginActive ? (
                        <>
                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <FaEnvelope className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <FaLock className='icon' />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Name'
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    required
                                />
                                <FaUser className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Email'
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required
                                />
                                <FaEnvelope className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder='Password'
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    required
                                />
                                <FaLock className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="direction"
                                    placeholder='Address'
                                    value={formData.direction || ''}
                                    onChange={handleChange}
                                />
                                <FaMapMarkerAlt className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="tel"
                                    name="telephone_number"
                                    placeholder='Phone Number'
                                    value={formData.telephone_number || ''}
                                    onChange={handleChange}
                                />
                                <FaPhone className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="file"
                                    name="user_image"
                                    placeholder='Profile Image'
                                    onChange={handleImageChange}  // Update image change handler
                                />
                                <FaImage className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="card_holder"
                                    placeholder='Card Holder'
                                    value={formData.card_holder}
                                    onChange={handleChange}
                                />
                                <FaCcVisa className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="card_number"
                                    placeholder='Card Number'
                                    value={formData.card_number}
                                    onChange={handleChange}
                                />
                                <FaCcVisa className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="expiration_date"
                                    placeholder='Expiration Date (YY-MM-DD)'
                                    value={formData.expiration_date}
                                    onChange={handleChange}
                                />
                                <FaCcVisa className='icon' />
                            </div>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="cvv"
                                    placeholder='CVV'
                                    value={formData.cvv}
                                    onChange={handleChange}
                                />
                                <FaCcVisa className='icon' />
                            </div>
                        </>
                    )}

                    <div className="remember-forgot">
                        {isLoginActive ? (
                            <a href="#">Forgot password?</a>
                        ) : (
                            <label></label>
                        )}
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : (isLoginActive ? 'Login' : 'Register')}
                    </button>
                    
                    <div className="register-link">
                        <p>
                            {isLoginActive ? "Don't have an account?" : "Already have an account?"}
                            <a href="#" onClick={() => setIsLoginActive(!isLoginActive)}>
                                {isLoginActive ? ' Register' : ' Login'}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginForm;
