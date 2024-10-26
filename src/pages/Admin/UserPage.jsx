import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        console.log(data); // Verifica la estructura de los datos
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

  const handleDelete = (userId) => {
    console.log(`Delete user with ID: ${userId}`);
    ecommerce_fetch(`${baseUrl}/users.php?id_user=${userId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting user');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        setUsers(prevUsers => prevUsers.filter(user => user.ID_User !== userId));
      })
      .catch(err => alert('Error: ' + err.message));
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
                <button className="delete-button" onClick={() => handleDelete(user.ID_User)}>Delete</button>
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
