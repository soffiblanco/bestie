import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './CatalogProducts.css';
import { useParams, useNavigate } from 'react-router-dom';

const SubcategoryCatalog = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { categoryId } = useParams();  // Obtenemos el ID de la categoría de la URL
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost/apis/subcategory.php?id_category=${categoryId}`)  // API para subcategorías
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
    }, [categoryId]);

    const handleSubcategoryClick = (subcategoryId) => {
        navigate(`/product/${subcategoryId}`);  // Redirige a la página de detalles del producto
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
                            key={subcategory.id_subcategory} 
                            className="subcategory-card" 
                            onClick={() => handleSubcategoryClick(subcategory.id_subcategory)}
                        >
                            <img src={subcategory.subcategory_image} alt={subcategory.subcategory} className="subcategory-image"/>
                            <h3>{subcategory.subcategory}</h3>
                            <p>{subcategory.subcategory_description}</p>
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
