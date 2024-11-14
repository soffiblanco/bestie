import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './CatalogProducts.css';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const SubcategoryCatalog = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { category, subcategory } = useParams();  // Obtenemos el ID de la categoría de la URL
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
         ecommerce_fetch(`${baseUrl}/product_categories_subcategories_view.php?category=${category}&subcategory=${subcategory}`, { method: 'GET' })  // API para subcategorías
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
    }, [category]);

    const handleProductClick = (ID_Product) => {
        navigate(`/CatalogProducts/${category}/${subcategory}/product/${ID_Product}`);  // Redirige a la página de detalles del producto
    };   

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h2>Productos</h2>
            {subcategories.length > 0 ? (
                <div className="subcategories-grid">
                    {subcategories.map((product) => (
                        <div 
                            key={product.ID_Product} 
                            className="subcategory-card" 
                            onClick={() => handleProductClick(product.ID_Product)}
                        >
                            <img src={product.Product_Image} alt={product.Product} className="subcategory-image"/>
                            <h3>{product.Product}</h3>
                            <p>{product.Product_Description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay subcategorías para esta categoría</p>
            )}
        </div>
    );
};

export default SubcategoryCatalog;
