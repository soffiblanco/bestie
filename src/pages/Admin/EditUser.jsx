import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
;

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [fieldsToUpdate, setFieldsToUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageBase64, setImageBase64] = useState('');

  useEffect(() => {
    fetch(`http://localhost/apis/users.php?id_user=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching user');
        }
        return response.json();
      })
      .then((data) => {
        const userData = data.data[0];
        setUser(userData);
        setFormData(userData);

        const initialFieldsToUpdate = {};
        ['name', 'email', 'role', 'telephone_number', 'direction', 'card_number', 'expiration_date', 'cvv', 'user_state', 'user_image'].forEach((field) => {
          initialFieldsToUpdate[field] = false;
        });
        setFieldsToUpdate(initialFieldsToUpdate);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

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
        const mimeType = file.type; // Obtener el tipo de archivo, por ejemplo "image/jpeg"
        const fullBase64String = `data:${mimeType};base64,${base64String}`; // Construir el string completo
        setImageBase64(fullBase64String); // Guardar la imagen con el prefijo adecuado
        console.log('Full Image Base64:', fullBase64String); // Mensaje de depuración para la imagen completa
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto solo con los campos seleccionados para actualizar
    const dataToSend = { id_user: userId };

    Object.keys(fieldsToUpdate).forEach((field) => {
      if (fieldsToUpdate[field]) {
        if (field === 'user_image') {
          dataToSend[field] = imageBase64; // Usar la imagen en base64 con el encabezado adecuado
        } else {
          dataToSend[field] = formData[field];
        }
      }
    });

    // Mensajes de depuración antes de enviar la solicitud
    console.log('User ID:', userId);
    console.log('Fields to update:', fieldsToUpdate);
    console.log('Form data:', formData);
    console.log('Data to send in PUT request:', JSON.stringify(dataToSend, null, 2));

    // Verificar si el userId está definido
    if (!userId) {
      console.error('User ID is undefined. Cannot submit form.');
      alert('Error: User ID is undefined.');
      return;
    }

    // Enviar el JSON al backend
    fetch(`http://localhost/apis/users.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend), // Convertir los datos a JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error updating user');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response from server:', data); // Mensaje de depuración para la respuesta del servidor
        alert(data.message);
        navigate('/UserPage');
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
    <div className="edit-user-container">
      <h1 className="form-title">Edit User</h1>
      <form onSubmit={handleSubmit} className="edit-user-form">
        {user && (
          <>
            {['name', 'email', 'role', 'telephone_number', 'direction', 'card_number', 'expiration_date', 'cvv', 'user_state'].map((field) => (
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
                name="user_image"
                onChange={handleCheckboxChange}
                id="checkbox-user_image"
              />
              <label htmlFor="checkbox-user_image" className="field-label">
                User Image
              </label>
              <input
                type="file"
                name="user_image"
                onChange={handleImageChange}
                disabled={!fieldsToUpdate['user_image']}
                className="field-input"
              />
            </div>

            <button type="submit" className="submit-button">Update User</button>
          </>
        )}
      </form>
    </div>
  );
};

export default EditUser;
