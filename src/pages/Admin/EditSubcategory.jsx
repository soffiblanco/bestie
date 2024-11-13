import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Edit.css';

const EditSubcategory = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ id_category: "", subcategory: "", subcategory_description: "" });
  const [initialData, setInitialData] = useState({ id_category: "", subcategory: "", subcategory_description: "", subcategory_image: "" });
  const [imageBase64, setImageBase64] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch subcategory data
    ecommerce_fetch(`${baseUrl}/subcategory.php?id_subcategory=${subcategoryId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const subcategoryData = data.data[0];
        setInitialData(subcategoryData);
        setFormData({
          id_category: subcategoryData.id_category || "",
          subcategory: subcategoryData.subcategory || "",
          subcategory_description: subcategoryData.subcategory_description || "",
        });
        setImageBase64(subcategoryData.subcategory_image || "");
      })
      .catch((err) => {
        setError(err.message);
        toast.error('Error loading subcategory data');
      });

    // Fetch categories data
    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
      })
      .catch(() => {
        toast.error('Error loading categories');
      });
  }, [subcategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar si los campos están vacíos
    if (!formData.id_category || !formData.subcategory.trim() || !formData.subcategory_description.trim()) {
      toast.error("Fields cannot be left empty");
      return;
    }

    // Verificar si se realizaron cambios
    if (
      formData.id_category === initialData.id_category &&
      formData.subcategory === initialData.subcategory &&
      formData.subcategory_description === initialData.subcategory_description &&
      imageBase64 === initialData.subcategory_image
    ) {
      toast.info("No changes have been made.");
      setTimeout(() => {
        navigate('/subcategories');
      }, 2000);
      return;
    }

    setLoading(true);

    const dataToUpdate = {
      id_subcategory: subcategoryId,
      id_category: formData.id_category,
      subcategory: formData.subcategory,
      subcategory_description: formData.subcategory_description,
      subcategory_image: imageBase64,
    };

    ecommerce_fetch(`${baseUrl}/subcategory.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToUpdate),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message || "Subcategory updated successfully");
        setTimeout(() => {
          navigate('/subcategories');
        }, 2000);
      })
      .catch((err) => {
        console.error('Error during update:', err);
        toast.error('Error updating subcategory');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="edit-user-container">
        <h1 className="form-title">Edit Subcategory</h1>
        <form onSubmit={handleSubmit} className="edit-user-form">

          <div className="form-field">
            <label htmlFor="id_category" className="field-label">Category:</label>
            <select
              name="id_category"
              value={formData.id_category}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="subcategory" className="field-label">Subcategory:</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="subcategory_description" className="field-label">Description:</label>
            <textarea
              name="subcategory_description"
              value={formData.subcategory_description}
              onChange={handleChange}
              className="field-input"
              required
            ></textarea>
          </div>

          <div className="form-field">
            <label htmlFor="subcategory_image" className="field-label">Image:</label>
            {imageBase64 && (
              <div className="image-preview">
                <img src={imageBase64} alt="Current Subcategory" className="img-edit" />
              </div>
            )}
            <input
              type="file"
              name="subcategory_image"
              accept="image/*"
              onChange={handleImageChange}
              className="field-input"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditSubcategory;
