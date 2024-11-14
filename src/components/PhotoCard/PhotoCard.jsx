import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PhotoCard.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const PhotoCard = () => {
    const [categoryImages, setCategoryImages] = useState({});
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Obtener las subcategorías agrupadas por categoría desde la API
    useEffect(() => {
        ecommerce_fetch(`${baseUrl}/category_subcategory_unique_view.php`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    // Agrupar las subcategorías por categoría y limitar a 5 categorías
                    const groupedCategories = data.data.reduce((acc, subcategory) => {
                        const category = subcategory.Category;
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push(subcategory);
                        return acc;
                    }, {});

                    // Limitar a las primeras 5 categorías
                    const limitedCategories = Object.entries(groupedCategories).slice(0, 5);
                    setCategories(limitedCategories);
                } else {
                    console.error("Estructura de datos inesperada:", data);
                }
            })
            .catch((error) => console.error('Error al obtener categorías:', error));
    }, []);

    // Cambiar las imágenes aleatoriamente cada 3 segundos
    useEffect(() => {
        if (categories.length > 0) {
            const initializeImages = () => {
                const initialImages = categories.reduce((acc, [category, subcategories]) => {
                    const randomSubcategory = getRandomSubcategory(subcategories);
                    acc[category] = randomSubcategory.Subcategory_Image;
                    return acc;
                }, {});
                setCategoryImages(initialImages);
            };

            initializeImages();

            const interval = setInterval(() => {
                setCategoryImages((prevImages) => {
                    const newImages = { ...prevImages };
                    categories.forEach(([category, subcategories]) => {
                        const randomSubcategory = getRandomSubcategory(subcategories);
                        newImages[category] = randomSubcategory.Subcategory_Image;
                    });
                    return newImages;
                });
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [categories]);

    // Seleccionar aleatoriamente una subcategoría de la lista de subcategorías
    const getRandomSubcategory = (subcategories) => {
        const randomIndex = Math.floor(Math.random() * subcategories.length);
        return subcategories[randomIndex];
    };

    const handleCategoryClick = (category) => {
        navigate(`/CatalogProducts/${category}`);
    };

    return (
        <div className="photo-card">
            {categories.map(([category, subcategories], index) => (
                <div key={index} className="photo-card-item" onClick={() => handleCategoryClick(category)}>
                    <h3 className="photo-card-category-title">{category || "Categoría desconocida"}</h3>
                    <img
                        src={categoryImages[category] || "https://via.placeholder.com/150"} // Imagen placeholder si no hay imagen
                        alt={category || "Categoría desconocida"}
                        className="photo-card-category-image"
                    />
                </div>
            ))}
        </div>
    );
};

export default PhotoCard;



