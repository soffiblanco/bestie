import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js';
import './Add.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryState, setCategoryState] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoryStatesOptions, setCategoryStatesOptions] = useState([]);
  const [imageBase64, setImageBase64] = useState('');
  const navigate = useNavigate();

  // Obtener opciones de estado de categoría
  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/category.php?fields=Category_State`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch category states');
        }
        return response.json();
      })
      .then((data) => {
        // Extraemos la lista de estados de las categorías
        let categoriesState = [...new Set(data.data.map((item) => item.Category_State))];
        setCategoryStatesOptions(categoriesState);
      })
      .catch((error) => {
        toast.error('Error: ' + error.message);
      });
  }, []);

  // Manejar el cambio de la imagen y actualizar el estado
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

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Crear objeto para enviar la imagen y los otros datos
    const data = {
      category,
      category_description: categoryDescription,
      category_state: categoryState,
    };

    if (imageBase64) {
      data.category_image = imageBase64;
    }

    // // Crear FormData para enviar la imagen y los otros datos
    // const formData = new FormData();
    // formData.append('category', category);
    // formData.append('category_description', categoryDescription);

    // // Agregar la imagen solo si se seleccionó
    // if (categoryImage) {
    //   formData.append('category_image', categoryImage);
    // }

    // formData.append('category_state', categoryState);

    // Hacer la solicitud POST para agregar la categoría
    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Error uploading image.');
          });
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message || 'Category added successfully');
        // Limpiar el formulario después de un éxito
        setCategory('');
        setCategoryDescription('');
        setImageBase64(null);
        setCategoryState('');
        setTimeout(() => {
          navigate('/categoriesp');
        }, 2000);
      })
      .catch((error) => {
        toast.error('Error: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="add-category-container">
        <h1>Add New Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="category">Category Name:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="category_description">Category Description:</label>
            <textarea
              id="category_description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              rows="4"
              placeholder="Enter category description"
              required
            ></textarea>
          </div>
          <div className="input-container">
            <label htmlFor="category_image">Category Image:</label>
            <input
              type="file"
              id="category_image"
              accept="image/*"
              onChange={handleImageChange}
              //required
            />
          </div>
          <div className="input-container">
            <label htmlFor="category_state">Category State:</label>
            <select
              id="category_state"
              value={categoryState}
              onChange={(e) => setCategoryState(e.target.value)}
              required
            >
              <option value="">Select category state</option>
              {categoryStatesOptions.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategory;
