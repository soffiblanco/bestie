import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);

    useEffect(() => {
        
        fetch(`http://localhost/apis/products.php?id=${id}`) 
            .then(response => response.json())
            .then(data => setProduct(data))
            .catch(error => console.error('Error fetching product details:', error));
    }, [id]);

    if (!product) {
        return <div>Cargando detalles del producto...</div>;
    }

    return (
        <div className="product-details">
            <h2>{product.Product}</h2>
            <img src={product.Product_Image} alt={product.Product} />
            <p>{product.Product_Description}</p>
            <p>Precio: ${product.Price}</p>
        </div>
    );
};

export default ProductDetails;

