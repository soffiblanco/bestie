import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // Cambiado a plural
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Imagen predeterminada en formato Base64
  const defaultImageBase64 = ''; // Asegúrate de añadir el código base64 aquí

  useEffect(() => {
    fetch('http://localhost/apis/category.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Verifica la estructura de los datos
        setCategories(data.data || []); // Asegúrate de que 'data' tenga el formato esperado
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (categoryId) => {
    navigate(`/EditCategory/${categoryId}`);
  };
  
  const handleDelete = (categoryId) => {
    console.log(`Delete category with ID: ${categoryId}`);
    fetch(`http://localhost/apis/category.php?id_category=${categoryId}`, {
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
        setCategories(prevCategories => prevCategories.filter(category => category.id_category !== categoryId));
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleAddUser = () => {
    navigate('/AddCategory'); 
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-page-container">
      <h1 className="table-title">Category List</h1> {/* Cambiado a "Category List" */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Category Image</th>
            <th>ID</th>
            <th>Category</th>
            <th>Category Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => ( // Cambiado a 'categories' y verificación de datos
            <tr key={category.id_category}>
              <td>
                <img
                  className="profile-image"
                  src={category.category_image || defaultImageBase64} // Cambiado a 'category.category_image'
                  alt={category.category || 'Category Image'}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{category.id_category || 'ID not available'}</td> {/* Cambiado a 'id_category' */}
              <td>{category.category || 'Category Name not available'}</td>
              <td>{category.category_description || 'Category Description not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(category.id_category)}>Edit</button> {/* Cambiado a 'id_category' */}
                <button className="delete-button" onClick={() => handleDelete(category.id_category)}>Delete</button> {/* Pasando 'category.id_category' */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Add User</button>
    </div>
  );
};

export default CategoryPage;
