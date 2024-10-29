import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import { useAuth } from '../../Auth/AuthContext.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import './Edit.css';

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id_role: '',
    telephone_number: '',
    direction: '',
    card_holder: '',
    card_number: '',
    expiration_date: '',
    cvv: '',
    user_state: '',
    user_image: ''
  });
  const [fieldsToUpdate, setFieldsToUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {

    toast.info('Toast de prueba para verificar funcionamiento.');

    
    setLoading(true);
    console.log("Fetching user data...");
    ecommerce_fetch(`${baseUrl}/users.php?id_user=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching user');
        }
        return response.json();
      })
      .then((data) => {
        const userData = data.data[0];
        setUser(userData);
        setFormData(userData);

        const initialFieldsToUpdate = {};
        [
          'name',
          'email',
          'id_role',
          'telephone_number',
          'direction',
          'card_holder',
          'card_number',
          'expiration_date',
          'cvv',
          'user_state',
          'user_image'
        ].forEach((field) => {
          initialFieldsToUpdate[field] = false;
        });
        setFieldsToUpdate(initialFieldsToUpdate);
      })
      .catch((err) => {
        setError(err.message);
        toast.error('Failed to fetch user data');
      })
      .finally(() => {
        setLoading(false);
        console.log("User data fetch complete");
      });
  }, [userId, userData.token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFieldsToUpdate({
      ...fieldsToUpdate,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const mimeType = file.type;
        const fullBase64String = `data:${mimeType};base64,${base64String}`;
        setImageBase64(fullBase64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('handleSubmit called'); // Debug message

    const dataToSend = { id_user: userId };
    Object.keys(fieldsToUpdate).forEach((field) => {
      if (fieldsToUpdate[field]) {
        dataToSend[field] = field === 'user_image' ? imageBase64 : formData[field];
      }
    });

    if (!userId) {
      toast.error('User ID is undefined. Cannot submit form.');
      return;
    }

    setLoading(true);
    console.log("Sending PUT request..."); // Debug message
    ecommerce_fetch(`${baseUrl}/users.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Error updating user data');
          });
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message || 'User updated successfully');
        setTimeout(() => {
          navigate('/users');
        }, 2000);
      })
      .catch((err) => {
        console.error('Error updating user:', err); // Debug message
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        console.log("PUT request complete"); // Debug message
      });
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="edit-user-container">
        <h1 className="form-title">{loading ? 'Edit User (Loading...)': 'Edit User'}</h1>
        <form onSubmit={handleSubmit} className="edit-user-form">
          {user && (
            <>
              {['name', 'email', 'id_role', 'telephone_number', 'direction', 'card_holder', 'card_number', 'expiration_date', 'cvv', 'user_state'].map((field) => (
                <div key={field} className="form-field">
                  <input
                    type="checkbox"
                    name={field}
                    onChange={handleCheckboxChange}
                    id={`checkbox-${field}`}
                  />
                  <label htmlFor={`checkbox-${field}`} className="field-label">
                    {field.replace('_', ' ')}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    disabled={!fieldsToUpdate[field]}
                    className="field-input"
                  />
                </div>
              ))}

              <div className="form-field">
                <input
                  type="checkbox"
                  name="user_image"
                  onChange={handleCheckboxChange}
                  id="checkbox-user_image"
                />
                <label htmlFor="checkbox-user_image" className="field-label">
                  User Image
                </label>
                <input
                  type="file"
                  name="user_image"
                  onChange={handleImageChange}
                  disabled={!fieldsToUpdate['user_image']}
                  className="field-input"
                />
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default EditUser;
