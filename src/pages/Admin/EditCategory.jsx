import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import './Edit.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const EditCategory = () => {
    const { categoryId } = useParams();
    const [formData, setFormData] = useState({
        category: "",
        category_description: "",
        fieldsToUpdate: []
    });
    const [imageBase64, setImageBase64] = useState(""); // Estado para la imagen base64
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
                    setFormData({
                        ...formData,
                        category: categoryData.category || "",
                        category_description: categoryData.category_description || ""
                    });
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
                console.log("Imagen en base64:", fullBase64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const fieldsToUpdate = checked
                ? [...prevData.fieldsToUpdate, value]
                : prevData.fieldsToUpdate.filter((field) => field !== value);
            
                console.log("Campos seleccionados para actualizar:", fieldsToUpdate);

                return { ...prevData, fieldsToUpdate };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.fieldsToUpdate.length === 0) {
            toast.warn("Please select at least one field to update.");
            return;
        }

        setLoading(true);

        const dataToUpdate = {
            id_category: categoryId
        };
 
        formData.fieldsToUpdate.forEach((field) => {
            if (field === "category_image" && imageBase64) {
                dataToUpdate[field] = imageBase64;
            } else {
                dataToUpdate[field] = formData[field];
            }
        });

        console.log("Datos a enviar al servidor:", JSON.stringify(dataToUpdate, null, 2));

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
        <div className="edit-category-container">
            <h2 className="form-title">Edit Category</h2>
            <form onSubmit={handleSubmit} className="edit-category-form">

                <div className="form-field">
                    <input
                        type="checkbox"
                        id="updateCategory"
                        value="category"
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="updateCategory" className="field-label">Update Category Name</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="field-input"
                    />
                </div>

                <div className="form-field">
                    <input
                        type="checkbox"
                        id="updateDescription"
                        value="category_description"
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="updateDescription" className="field-label">Update Description</label>
                    <textarea
                        name="category_description"
                        value={formData.category_description}
                        onChange={handleInputChange}
                        className="field-input"
                    ></textarea>
                </div>

                <div className="form-field">
                    <input
                        type="checkbox"
                        id="updateImage"
                        value="category_image"
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="updateImage" className="field-label">Update Image</label>
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
