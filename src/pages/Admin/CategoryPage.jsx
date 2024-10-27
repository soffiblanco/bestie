import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch.js';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]); // Cambiado a plural
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Imagen predeterminada en formato Base64
  const defaultImageBase64 = ''; // Asegúrate de añadir el código base64 aquí

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        return response.json();
      })
      .then(data => {
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

  const handleToggleState = (categoryId, currentState) => {

    console.log("Sending PATCH request with:", { id_category: categoryId }); // Depuración: JSON que se enviará

    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_category: categoryId
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error updating category state');
        }
        return response.json();
      })
      .then(data => {
        console.log("Response from server:", data); 
        toast.success(data.message);
        // Actualizar el estado de categoría en el frontend
        setCategories(prevCategories =>
          prevCategories.map(category =>
            category.id_category === categoryId
              ? { ...category, Category_State: currentState === 'Enabled' ? 'Disabled' : 'Enabled' }
              : category
          )
        );
        console.log("Updated categories state:", categories);
        document.activeElement.blur();
      })
      .catch(err => toast.error('Error: ' + err.message));
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
      <ToastContainer />
      <h1 className="table-title">Category List</h1> {/* Cambiado a "Category List" */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Category Image</th>
            <th>ID</th>
            <th>Category</th>
            <th>Category Description</th>
            <th>Status</th>
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
              <td>{category.Category_State || 'Category State not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(category.id_category)}>Edit</button> 
                <button
                  className="toggle-state-button"
                  onClick={() => handleToggleState(category.id_category, category.Category_State)}
                >
                  {category.Category_State === 'Enabled' ? 'Disable' : 'Enabled'}
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

export default CategoryPage;