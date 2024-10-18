import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch'; 
import EditCategory from './EditCategory.jsx';

const EditSubcategory = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [subcategory, setSubcategory] = useState(null);
  const [formData, setFormData] = useState({});
  const [fieldsToUpdate, setFieldsToUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/subcategory.php?id_subcategory=${subcategoryId}`,{
       method:'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching subcategory');
        }
        return response.json();
      })
      .then((data) => {
        const subcategoryData = data.data[0];
        setSubcategory(subcategoryData);
        setFormData(subcategoryData);

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
        console.log('Full Image Base64:', fullBase64String);
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

    console.log('Subcategory ID:', subcategoryId);
    console.log('Fields to update:', fieldsToUpdate);
    console.log('Form data:', formData);
    console.log('Data to send in PUT request:', JSON.stringify(dataToSend, null, 2));

    if (!subcategoryId) {
      console.error('Subcategory ID is undefined. Cannot submit form.');
      alert('Error: Subcategory ID is undefined.');
      return;
    }

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
        console.log('Response from server:', data);
        alert(data.message);
        navigate('/SubcategoryPage');
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
    <div className="edit-subcategory-container">
      <h1 className="form-title">Edit Subcategory</h1>
      <form onSubmit={handleSubmit} className="edit-subcategory-form">
        {subcategory && (
          <>
            {['id_category', 'subcategory', 'subcategory_description'].map((field) => (
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
          </>
        )}
      </form>
    </div>
  );
};

export default EditSubcategory;