import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSubcategory = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [fieldsToUpdate, setFieldsToUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [categories, setCategories] = useState([]); // State to store available categories
 

  useEffect(() => {
    // Fetch subcategory data
    ecommerce_fetch(`${baseUrl}/subcategory.php?id_subcategory=${subcategoryId}`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching subcategory');
        }
        return response.json();
      })
      .then((data) => {
        const subcategoryData = data.data[0];
        setFormData({
          ...subcategoryData,
          id_category: subcategoryData.id_category, // Set current category ID
        });

        const initialFieldsToUpdate = {};
        ['id_category', 'subcategory', 'subcategory_description', 'subcategory_image'].forEach((field) => {
          initialFieldsToUpdate[field] = false;
        });
        setFieldsToUpdate(initialFieldsToUpdate);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Fetch categories data
    ecommerce_fetch(`${baseUrl}/category.php`, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.data);
      })
      .catch((err) => {
        toast.error('Error fetching categories:', err);
      });
  }, [subcategoryId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFieldsToUpdate({
      ...fieldsToUpdate,
      [e.target.name]: e.target.checked,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { id_subcategory: subcategoryId };

    Object.keys(fieldsToUpdate).forEach((field) => {
      if (fieldsToUpdate[field]) {
        if (field === 'subcategory_image') {
          dataToSend[field] = imageBase64;
        } else {
          dataToSend[field] = formData[field];
        }
      }
    });

    ecommerce_fetch(`${baseUrl}/subcategory.php`, {
      method: 'PUT',
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error updating subcategory');
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message|| 'Subctegory edited successfully');
        setTimeout(() => {
          navigate('/subcategories');
        }, 2000);
      })
      .catch((err) => {
        console.error('Error during update:', err);
        alert('Error: ' + err.message);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <ToastContainer position="top-right" />
    <div className="edit-subcategory-container">
      <h1 className="form-title">Edit Subcategory</h1>
      <form onSubmit={handleSubmit} className="edit-subcategory-form">
        <div className="form-field">
          <input
            type="checkbox"
            name="id_category"
            onChange={handleCheckboxChange}
            id="checkbox-id_category"
          />
          <label htmlFor="checkbox-id_category" className="field-label">
            Category:
          </label>
          <select
            name="id_category"
            value={formData.id_category || ''} // Set the selected category
            onChange={handleChange}
            disabled={!fieldsToUpdate['id_category']}
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

        {['subcategory', 'subcategory_description'].map((field) => (
          <div key={field} className="form-field">
            <input
              type="checkbox"
              name={field}
              onChange={handleCheckboxChange}
              id={`checkbox-${field}`}
            />
            <label htmlFor={`checkbox-${field}`} className="field-label">
              {field.replace('_', ' ')}:
            </label>
            <input
              type="text"
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
              disabled={!fieldsToUpdate[field]}
              className="field-input"
            />
          </div>
        ))}

        <div className="form-field">
          <input
            type="checkbox"
            name="subcategory_image"
            onChange={handleCheckboxChange}
            id="checkbox-subcategory_image"
          />
          <label htmlFor="checkbox-subcategory_image" className="field-label">
            Subcategory Image
          </label>
          <input
            type="file"
            name="subcategory_image"
            onChange={handleImageChange}
            disabled={!fieldsToUpdate['subcategory_image']}
            className="field-input"
          />
        </div>

        <button type="submit" className="submit-button">Update Subcategory</button>
      </form>
    </div>
    </>
  );
};

export default EditSubcategory;
