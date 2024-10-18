import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch'; 

const SubcategoryPage = () => {
  const [subcategories, setSubcategories] = useState([]); // Cambiado a plural
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/subcategory.php`,{
        method:'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Verifica la estructura de los datos
        setSubcategories(data.data || []); // Asegúrate de que 'data' tenga el formato esperado
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (subcategoryId) => {
    navigate(`/EditSubcategory/${subcategoryId}`);
  };
  
  const handleDelete = (subcategoryId) => {
    console.log(`Delete subcategory with ID: ${subcategoryId}`);
    ecommerce_fetch(`${baseUrl}/subcategory.php?id_subcategory=${subcategoryId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting category');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        setSubcategories(prevSubcategories => prevSubcategories.filter(subcategory => subcategory.id_subcategory !== subcategoryId));
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleAddUser = () => {
    navigate('/AddSubcategory'); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-page-container">
      <h1 className="table-title">Subcategory List</h1> {/* Cambiado a "Subcategory List" */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Subcategory Image</th>
            <th>ID </th>
            <th>ID Category </th>
            <th>Subcategory</th>
            <th>Subcategory Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map(subcategory => ( // Cambiado a 'subcategories' y verificación de datos
            <tr key={subcategory.id_subcategory}>
              <td>
                <img
                  className="profile-image"
                  src={subcategory.subcategory_image} // Cambiado a 'category.category_image'
                  alt={subcategory.subcategory || 'Subcategory Image'}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{subcategory.id_subcategory || 'ID not available'}</td> {/* Cambiado a 'id_category' */}
              <td>{subcategory.id_category || 'ID not available'}</td>
              <td>{subcategory.subcategory || 'Subcategory Name not available'}</td>
              <td>{subcategory.subcategory_description || 'Subcategory Description not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(subcategory.id_subcategory)}>Edit</button> {/* Cambiado a 'id_category' */}
                <button className="delete-button" onClick={() => handleDelete(subcategory.id_subcategory)}>Delete</button> {/* Pasando 'category.id_category' */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Add</button>
    </div>
  );
};

export default SubcategoryPage;
