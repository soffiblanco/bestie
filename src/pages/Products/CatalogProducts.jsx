import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from './Product';
import 'bootstrap/dist/css/bootstrap.min.css'; 

function CatalogProducts() {
    const { category, subcategory } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = subcategory 
            ? `http://localhost/apis/products.php?category=${category}&subcategory=${subcategory}` 
            : `http://localhost/apis/products.php?category=${category}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.data && Array.isArray(data.data)) {
                    setProducts(data.data); // Usamos data.data como mencionaste
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setError('Error al cargar los productos');
                setLoading(false);
            });
    }, [category, subcategory]);

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">
                {subcategory 
                    ? `Catálogo de productos: ${category} - ${subcategory}`
                    : `Catálogo de productos: ${category}`}
            </h2>

            <div className="row mb-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="col-md-4" key={product.ID_Product}>
                            <Product 
                                productId={product.ID_Product} 
                                title={product.Product}
                                description={product.Product_Description}
                                price={product.Price}
                                image={product.Product_Image}
                            />
                        </div>
                    ))
                ) : (
                    <div>No se encontraron productos.</div>
                )}
            </div>
        </div>
    );
}

export default CatalogProducts;
