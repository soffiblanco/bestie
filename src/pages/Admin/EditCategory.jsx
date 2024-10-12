import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditCategory = () => {
    const { categoryId } = useParams(); // Obtén el ID de la categoría desde la URL
    const [formData, setFormData] = useState({
        category: "",
        category_description: "",
        category_image: null,
        fieldsToUpdate: []
    });

    useEffect(() => {
        // Aquí puedes cargar los datos de la categoría actual si es necesario
        fetch(`http://localhost/apis/category.php?id_category=${categoryId}`)
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
            .catch(error => console.error("Error cargando la categoría:", error));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.fieldsToUpdate.length === 0) {
            alert("Por favor, selecciona al menos un campo para actualizar.");
            return;
        }

        // Crear el objeto con los campos a actualizar
        const dataToUpdate = {
            id_category: categoryId
        };

        formData.fieldsToUpdate.forEach((field) => {
            if (field === "category_image" && formData.category_image) {
                // Leer la imagen como base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    dataToUpdate[field] = reader.result;
                    enviarDatos(dataToUpdate);
                };
                reader.readAsDataURL(formData.category_image);
            } else {
                dataToUpdate[field] = formData[field];
            }
        });

        // Si no hay imagen para actualizar, se envían los datos directamente
        if (!formData.fieldsToUpdate.includes("category_image")) {
            enviarDatos(dataToUpdate);
        }
    };

    const enviarDatos = async (dataToUpdate) => {
        try {
            const response = await fetch("http://localhost/apis/category.php", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToUpdate)
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Categoría</h2>

            <div>
                <input
                    type="checkbox"
                    id="updateCategory"
                    value="category"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="updateCategory">Actualizar Nombre de Categoría</label>
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
                <label htmlFor="updateDescription">Actualizar Descripción</label>
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
                <label htmlFor="updateImage">Actualizar Imagen</label>
                <input
                    type="file"
                    name="category_image"
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit">Guardar Cambios</button>
        </form>
    );
};

export default EditCategory;
