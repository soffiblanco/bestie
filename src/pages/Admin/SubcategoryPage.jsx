import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Page.css';

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
  

  const handleToggleState = (subcategoryId, currentState) => {

    console.log("Sending PATCH request with:", { id_subcategory: subcategoryId }); // Depuración: JSON que se enviará

    ecommerce_fetch(`${baseUrl}/subcategory.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_subcategory: subcategoryId
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
        setSubcategories(prevSubcategories =>
          prevSubcategories.map(subcategory =>
            subcategory.id_subcategory === subcategoryId
              ? { ...subcategory, Subcategory_State: currentState === 'Enabled' ? 'Disabled' : 'Enabled' }
              : subcategory
          )
        );
        console.log("Updated categories state:", subcategories);
        document.activeElement.blur();
      })
      .catch(err => toast.error('Error: ' + err.message));
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
      <ToastContainer />
      <h1 className="table-title">Subcategory List</h1> {/* Cambiado a "Subcategory List" */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Subcategory Image</th>
            <th>ID </th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Subcategory Description</th>
            <th>Subcategory State</th>
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
              <td>{subcategory.id_subcategory || 'ID not available'}</td> 
              <td>{subcategory.category || 'Category not available'}</td>
              <td>{subcategory.subcategory || 'Subcategory Name not available'}</td>
              <td>{subcategory.subcategory_description || 'Subcategory Description not available'}</td>
              <td>{subcategory.Subcategory_State || 'Subcategory State not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(subcategory.id_subcategory)}>Edit</button> {/* Cambiado a 'id_category' */}
                <button
                  className="toggle-state-button"
                  onClick={() => handleToggleState(subcategory.id_subcategory, subcategory.Subcategory_State)}
                >
                  {subcategories.Subcategory_State === 'Enabled' ? 'Disable' : 'Enabled'}
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

export default SubcategoryPage;
