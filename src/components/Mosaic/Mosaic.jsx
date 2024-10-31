import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mosaic.css';

const Mosaic = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate(); // Para redirección programática

    useEffect(() => {
        // Llamada a la API para obtener productos aleatorios de cada categoría
        fetch('http://localhost/apis/Mosaic.php')
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    setCategories(data.data);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/catalogProducts/${categoryId}`);  // Redirige al catálogo de productos filtrado por categoría
    }; 

    return (
        <div className="categories-grid">
            {categories.map((category) => (
                <div
                    key={category.ID_Category}
                    className="category-item"
                    onClick={() => handleCategoryClick(category.Category)}
                >
                    <div
                        className="category-image"
                        style={{
                            backgroundImage: `url(${category.Product_Image})`
                        }}
                    >
                        <div className="category-name">{category.Category}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Mosaic;



