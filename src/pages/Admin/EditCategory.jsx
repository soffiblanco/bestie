import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import './Edit.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const { categoryId } = useParams();
    const [initialData, setInitialData] = useState({ category: "", category_description: "", category_image: "" });
    const [formData, setFormData] = useState({
        category: "",
        category_description: ""
    });
    const [imageBase64, setImageBase64] = useState(""); // Estado para la nueva imagen en base64
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        ecommerce_fetch(`${baseUrl}/category.php?id_category=${categoryId}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const categoryData = data.data[0];
                    setInitialData({
                        category: categoryData.category || "",
                        category_description: categoryData.category_description || "",
                        category_image: categoryData.category_image || "" // Guardar la imagen actual
                    });
                    setFormData({
                        category: categoryData.category || "",
                        category_description: categoryData.category_description || ""
                    });
                    setImageBase64(categoryData.category_image || ""); // Mostrar imagen actual si existe
                }
            })
            .catch(error => toast.error("Error loading category:", error));
    }, [categoryId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Verificar si los campos están vacíos
        if (!formData.category.trim() || !formData.category_description.trim()) {
            toast.error("Fields cannot be left empty");
            return;
        }

        // Verificar si se realizaron cambios
        if (
            formData.category === initialData.category &&
            formData.category_description === initialData.category_description &&
            !imageBase64
        ) {
            toast.info("No changes have been made.");
            setTimeout(() => {
                navigate('/categoriesp');
            }, 2000);
            return;
        }

        setLoading(true);

        const dataToUpdate = {
            id_category: categoryId,
            category: formData.category,
            category_description: formData.category_description,
            category_image: imageBase64 // Envía una cadena vacía si la imagen ha sido removida
        };

        ecommerce_fetch(`${baseUrl}/category.php`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        })
            .then(response => response.json())
            .then(data => {
                toast.success(data.message || "Category updated successfully");
                setTimeout(() => {
                    navigate('/categoriesp');
                }, 2000);
            })
            .catch(error => {
                toast.error("Error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="edit-user-container">
                <h2 className="form-title">Edit Category</h2>
                <form onSubmit={handleSubmit} className="edit-user-form">

                    <div className="form-field">
                        <label htmlFor="category" className="field-label">Category Name</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="field-input"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="category_description" className="field-label">Description</label>
                        <textarea
                            name="category_description"
                            value={formData.category_description}
                            onChange={handleInputChange}
                            className="field-input"
                        ></textarea>
                    </div>

                    <div className="form-field">
                        <label htmlFor="category_image" className="field-label">Image</label>
                        {initialData.category_image && (
                            <img
                                src={initialData.category_image}
                                alt="Current Category"
                                className="img-edit"
                            />
                        )}
                        <input
                            type="file"
                            name="category_image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
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

export default EditCategory;
