import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Mosaic.css';

const Mosaic = () => {
    const [categories, setCategories] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        // Llamada a la API para obtener productos aleatorios de cada categoría
        fetch('http://localhost/apis/Mosaic.php')  // Asegúrate de que la URL sea la correcta
            .then(response => response.json())
            .then(data => setCategories(data.data))
            .catch(error => console.error('Error fetching categories:', error));

        // Cambiar automáticamente la imagen de todas las categorías al mismo tiempo
        const intervalId = setInterval(() => {
            setImageIndex(prevIndex => (prevIndex + 1) % categories.length);
        }, 3000); // Cambiar la imagen cada 3 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, [categories.length]);

    return (
        <div>
            <div className="categories-grid">
                {categories.map((category, index) => (
                    <Link to={`/categories/${category.Category.toLowerCase()}`} key={index} className="category-item">
                        <div
                            className="category-image"
                            style={{
                                backgroundImage: `url(${category.Product_Image})`
                            }}
                        >
                            <div className="category-name">{category.Category}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Mosaic;

