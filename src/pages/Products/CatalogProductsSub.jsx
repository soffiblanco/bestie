import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './CatalogProducts.css';
import { useParams, useNavigate } from 'react-router-dom';

const SubcategoryCatalog = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { categoryId, subcategoryId } = useParams(); // Obtener ambos parámetros de la URL
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
    
        // Construir la URL de la API según los parámetros disponibles
        let apiUrl = `http://localhost/apis/products.php`;
        if (categoryId) {
            apiUrl += `?category=${categoryId}`;
        }
        if (subcategoryId) {
            apiUrl += categoryId ? `&subcategory=${subcategoryId}` : `?subcategory=${subcategoryId}`;
        }
    
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setSubcategories(data.data);
                } else {
                    setError('Datos de subcategorías inválidos');
                }
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener las subcategorías');
                setLoading(false);
            });
    }, [categoryId, subcategoryId]);
    

    const handleSubcategoryClick = (subcategoryId) => {
        navigate(`/product/${subcategoryId}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h2>Subcategorías</h2>
            {subcategories.length > 0 ? (
                <div className="subcategories-grid">
                    {subcategories.map((subcategory) => (
                        <div 
                            key={subcategory.ID_Product} 
                            className="subcategory-card" 
                            onClick={() => handleSubcategoryClick(subcategory.ID_Product)}
                        >
                            <img src={subcategory.Product_Image} alt={subcategory.Product} className="subcategory-image"/>
                            <h3>{subcategory.Subcategory}</h3>
                            <p>{subcategory.Product_Description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay productos para esta categoría/subcategoría</p>
            )}
        </div>
    );
};

export default SubcategoryCatalog;


