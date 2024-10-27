import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import './Add.css';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('category_description', categoryDescription);
    formData.append('category_image', categoryImage);

    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((error) => {
        setMessage('Error: ' + error.message);
        setLoading(false);
      });
  };

  return (
    <div className="add-category-container">
      <h1>Add New Category</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
              onChange={(e) => setCategoryImage(e.target.files[0])}
              required
            />
          </div>
          <button type="submit">Add Category</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddCategory;
