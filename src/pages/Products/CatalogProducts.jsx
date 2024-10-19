import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './CatalogProducts.css';

const CatalogProducts = () => {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/apis/category.php') 
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener las categorías');
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setLoading(true);

        fetch(`http://localhost/apis/subcategory.php?id_category=${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                setSubcategories(data.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener las subcategorías');
                setLoading(false);
            });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h1>Catálogo</h1>
            
            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category.id_category} className="category-card" onClick={() => handleCategoryClick(category.id_category)}>
                        <img src={category.category_image} alt={category.category} className="category-image"/>
                        <h3>{category.category}</h3>
                        <p>{category.category_description}</p>
                    </div>
                ))}
            </div>

            {selectedCategoryId && (
                <div className="subcategories-grid">
                    <h2>Subcategorías</h2>
                   
                        {subcategories.length > 0 ? (
                            subcategories.map((subcategory) => (
                                <div key={subcategory.id_subcategory} className="subcategory-card">
                                    <img src={subcategory.subcategory_image} alt={subcategory.subcategory} className="subcategory-image"/>
                                    <h3>{subcategory.subcategory}</h3>
                                    <p>{subcategory.subcategory_description}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay subcategorías para esta categoría</p>
                        )}
                    
                </div>
            )}
        </div>
    );
};

export default CatalogProducts;

