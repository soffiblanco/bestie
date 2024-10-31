import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Add.css';

const AddSubcategory = () => {
  const [idcategory, setIdcategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subcategoryDescription, setSubcategoryDescription] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [categories, setCategories] = useState([]); // State to store available categories
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Estado específico para controlar la acción de envío
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = () => {
      ecommerce_fetch(`${baseUrl}/category.php`, {
        method: 'GET', // Cambiado a GET para obtener datos
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Data fetched:', data); // Debug message
          setCategories(data.data); // Assign categories to state
          console.log('Categories loaded:', data.data);
        })
        .catch((error) => {
          toast.error('Error fetching categories: ' + error.message);
        })
        .finally(() => setLoading(false));
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('id_category', idcategory);
    formData.append('subcategory', subcategory);
    formData.append('subcategory_description', subcategoryDescription);
    formData.append('subcategory_image', subcategoryImage);

    fetch(`${baseUrl}/subcategory.php`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from server:', data); // Debug message for server response
        toast.success(data.message || 'Subcategory added successfully');
        setTimeout(() => {
          navigate('/subcategories');
        }, 1200);
        // Reset form fields after successful submission
        setIdcategory('');
        setSubcategory('');
        setSubcategoryDescription('');
        setSubcategoryImage(null);
      })
      .catch((error) => {
        console.error('Error submitting form:', error); // Debug message for errors
        toast.error('Error submitting form: ' + error.message);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="add-category-container">
        <h1>Add New Subcategory</h1>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="id_category">Category:</label><br />
              <select
                id="id_category"
                value={idcategory}
                onChange={(e) => setIdcategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <option key={category.id_category} value={category.id_category}>
                      {category.category}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="subcategory">Subcategory Name:</label><br />
              <input
                type="text"
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="subcategory_description">Subcategory Description:</label><br />
              <textarea
                id="subcategory_description"
                value={subcategoryDescription}
                onChange={(e) => setSubcategoryDescription(e.target.value)}
                rows="4"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="subcategory_image">Subcategory Image:</label><br />
              <input
                type="file"
                id="subcategory_image"
                accept="image/*"
                onChange={(e) => setSubcategoryImage(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Subcategory'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AddSubcategory;
