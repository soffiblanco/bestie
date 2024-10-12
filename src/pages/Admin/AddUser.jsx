import React, { useState } from 'react';
import axios from 'axios';
import './Add.css'; // Archivo CSS para los estilos
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaCcVisa, FaImage } from 'react-icons/fa';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    direction: '',
    telephone_number: '',
    user_image: null,
    role: '',
    card_number: '',
    expiration_date: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'user_image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost/apis/users.php';

    const data = new FormData();
    data.append('action', 'register');
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('direction', formData.direction);
    data.append('telephone_number', formData.telephone_number);
    data.append('role', formData.role);
    data.append('card_number', formData.card_number);
    data.append('expiration_date', formData.expiration_date);
    data.append('cvv', formData.cvv);
    if (formData.user_image) {
      data.append('user_image', formData.user_image);
    }

    setLoading(true);
    axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          alert(response.data.message);
        } else {
          setError('Something went wrong on the server.');
        }
      })
      .catch((error) => {
        console.error('Request error:', error.response ? error.response.data : error);
        setError(error.response?.data?.message || 'Request error.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="add-user-container">
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="name"
            placeholder='Name'
            value={formData.name}
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
        <div className="input-box">
          <input
            type="text"
            name="direction"
            placeholder='Direction'
            value={formData.direction}
            onChange={handleChange}
          />
          <FaMapMarkerAlt className='icon' />
        </div>
        <div className="input-box">
          <input
            type="tel"
            name="telephone_number"
            placeholder='Telephone Number'
            value={formData.telephone_number}
            onChange={handleChange}
          />
          <FaPhone className='icon' />
        </div>
        <div className="input-box">
          <input
            type="file"
            name="user_image"
            onChange={handleChange}
          />
          <FaImage className='icon' />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="role"
            placeholder='Role'
            value={formData.role}
            onChange={handleChange}
            required
          />
          <FaUser className='icon' />
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
            placeholder='Expiration Date (YYYY-MM-DD)'
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Add User'}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default AddUser;