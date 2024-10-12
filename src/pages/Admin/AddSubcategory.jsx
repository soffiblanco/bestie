import React, { useState, useEffect } from 'react';
import './Add.css';

const AddSubcategory= () => {
  const [idcategory, setIdcategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subcategoryDescription, setSubcategoryDescription] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [categories, setCategories] = useState([]); // State to store available categories
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = () => {
      fetch('http://localhost/apis/category.php') // Adjust the URL to the correct endpoint
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
          console.error('Error fetching categories:', error); // Debug message for errors
          setMessage('Error: ' + error.message);
        })
        .finally(() => setLoading(false));
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('id_category', idcategory);
    formData.append('subcategory', subcategory);
    formData.append('subcategory_description', subcategoryDescription);
    formData.append('subcategory_image', subcategoryImage);

    fetch('http://localhost/apis/subcategory.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Response from server:', data); // Debug message for server response
        setMessage(data.message);
      })
      .catch((error) => {
        console.error('Error submitting form:', error); // Debug message for errors
        setMessage('Error: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Add New Subcategory</h1>
      {loading ? (
        <p>Loading...</p>
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
                <option value="">Loading categories...</option>
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
          <br />
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
          <br />
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
          <br />
          <button type="submit">Add Subcategory</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddSubcategory;