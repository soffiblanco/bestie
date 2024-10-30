import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './CatalogProducts.css';
import { useNavigate } from 'react-router-dom'; 

const CategoryCatalog = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/apis/products.php?fields=Category')  // Filtrar solo por categoría
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    setError('Datos de categorías inválidos');
                }
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener las categorías');
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/catalog/${categoryId}`);  // Redirige al catálogo de productos filtrado por categoría
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h1>Catálogo de Categorías</h1>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div 
                        key={category.Category} 
                        className="category-card" 
                        onClick={() => handleCategoryClick(category.Category)}
                    >
                        <img src={category.category_image} alt={category.Category} className="category-image"/>
                        <h3>{category.Category}</h3>
                        <p>{category.category_description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCatalog;

