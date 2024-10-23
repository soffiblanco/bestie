import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';

const EditCategory = () => {
    const { categoryId } = useParams(); // Get the category ID from the URL
    const [formData, setFormData] = useState({
        category: "",
        category_description: "",
        category_image: null,
        fieldsToUpdate: []
    });

    useEffect(() => {
        // Load current category data if necessary
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
            .catch(error => console.error("Error loading category:", error));
    }, [categoryId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            category_image: e.target.files[0]
        });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const fieldsToUpdate = checked
                ? [...prevData.fieldsToUpdate, value]
                : prevData.fieldsToUpdate.filter((field) => field !== value);
            return { ...prevData, fieldsToUpdate };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.fieldsToUpdate.length === 0) {
            alert("Please select at least one field to update.");
            return;
        }

        // Create the object with the fields to update
        const dataToUpdate = {
            id_category: categoryId
        };

        formData.fieldsToUpdate.forEach((field) => {
            if (field === "category_image" && formData.category_image) {
                // Read the image as base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    dataToUpdate[field] = reader.result;
                    sendData(dataToUpdate);
                };
                reader.readAsDataURL(formData.category_image);
            } else {
                dataToUpdate[field] = formData[field];
            }
        });

        // If there is no image to update, send the data directly
        if (!formData.fieldsToUpdate.includes("category_image")) {
            sendData(dataToUpdate);
        }
    };

    const sendData = (dataToUpdate) => {
        ecommerce_fetch(`${baseUrl}/category.php`, {
            method: "PUT",
            body: JSON.stringify(dataToUpdate)
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Category</h2>

            <div>
                <input
                    type="checkbox"
                    id="updateCategory"
                    value="category"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="updateCategory">Update Category Name</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <input
                    type="checkbox"
                    id="updateDescription"
                    value="category_description"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="updateDescription">Update Description</label>
                <textarea
                    name="category_description"
                    value={formData.category_description}
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div>
                <input
                    type="checkbox"
                    id="updateImage"
                    value="category_image"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="updateImage">Update Image</label>
                <input
                    type="file"
                    name="category_image"
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit">Save Changes</button>
        </form>
    );
};

export default EditCategory;