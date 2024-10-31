import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CatalogProducts.css';
import { useParams, useNavigate } from 'react-router-dom';

const CatalogProductsSub = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { category, subcategory } = useParams(); // Extraemos 'category' y 'subcategory' de los parámetros de la URL
    const navigate = useNavigate();

    useEffect(() => {
        if (!category || !subcategory) {
            setError("No se ha especificado una categoría o subcategoría para el producto.");
            return;
        }

        console.log(`Fetching products for category: ${category}, subcategory: ${subcategory}`);

        setLoading(true);
        fetch(`http://localhost/apis/product_categories_subcategories_view.php?category=${category}&subcategory=${subcategory}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('API response:', data);
                if (data && Array.isArray(data.data) && data.data.length > 0) {
                    setProducts(data.data);
                } else {
                    setError(data.message || 'No se encontraron productos para esta categoría y subcategoría');
                }
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener los productos');
                console.error('Error en la llamada al API:', error);
                setLoading(false);
            });
    }, [category, subcategory]);

    // Ajusta `handleProductClick` para tomar el ID del producto actual
    const handleProductClick = (productId) => {
        navigate(`/CatalogProducts/${category}/${subcategory}/product/${productId}`);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h2>Productos de {subcategory} en {category}</h2>
            {products.length > 0 ? (
                <div className="categories-grid">
                    {products.map((product, index) => (
                        <div 
                            key={index} 
                            className="category-card" 
                            onClick={() => handleProductClick(product.ID_Product)} // Aquí pasamos el ID del producto actual
                        >
                            <img src={product.Product_Image} alt={product.Product} className="category-image" />
                            <h3>{product.Product}</h3>
                            <p>{product.Product_Description}</p>
                            <p><strong>Precio:</strong> ${product.Price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay productos para esta subcategoría y categoría</p>
            )}
        </div>
    );
};

export default CatalogProductsSub;


