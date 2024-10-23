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
        fetch('http://localhost/apis/category.php')  // API para categorías
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
        navigate(`/subcategories/${categoryId}`);  // Redirige al catálogo de subcategorías
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
                        key={category.id_category} 
                        className="category-card" 
                        onClick={() => handleCategoryClick(category.id_category)}
                    >
                        <img src={category.category_image} alt={category.category} className="category-image"/>
                        <h3>{category.category}</h3>
                        <p>{category.category_description}</p>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCatalog;

