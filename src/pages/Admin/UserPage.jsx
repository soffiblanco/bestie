import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch';  // Importa ecommerceFetch
import './Page.css';


const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/users.php`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (userId) => {
    navigate(`/EditUser/${userId}`);
  };

  const handleToggleState = (userId, currentState) => {
    ecommerce_fetch(`${baseUrl}/users.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_user: userId
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating user state');
        }
        return response.json();
      })
      .then(data => {
        toast.success(data.message);
        // Actualizar el estado de usuario en el frontend
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.ID_User === userId
              ? { ...user, User_State: currentState === 'Enabled' ? 'Disabled' : 'Enabled' }
              : user
          )
        );
      })
      .catch(err => toast.error('Error: ' + err.message));
  };
  const handleAddUser = () => {
    navigate('/AddUser'); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-page-container">
      <ToastContainer />
      <h1 className="table-title">User List</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID_User}>
              <td>
                <img
                  className="profile-image"
                  src={user.User_Image}
                  alt={user.Name || 'User Image'}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{user.ID_User || 'ID not available'}</td>
              <td>{user.Name || 'Name not available'}</td>
              <td>{user.ID_Role || 'Role not available'}</td>
              <td>{user.Email || 'Email not available'}</td>
              <td>{user.Telephone_Number || 'Phone number not available'}</td>
              <td>{user.Direction || 'Address not available'}</td>
              <td>{user.User_State || 'State not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user.ID_User)}>Edit</button>
                <button
                  className="toggle-state-button"
                  onClick={() => handleToggleState(user.ID_User, user.User_State)}
                >
                  {user.User_State === 'Enabled' ? 'Disable' : 'Enabled'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Add</button>
    </div>
  );
};

export default UserPage;
