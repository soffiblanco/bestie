// ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetails() {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Llamada a la API para obtener el producto por su id
        fetch(`http://localhost/apis/products.php?id=${id}`)
            .then(response => response.json())
            .then(data => setProduct(data.product))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="product-details-container">
            <h2>{product.title}</h2>
            <img src={product.image} alt={product.title} />
            <p>{product.description}</p>
            <p>Precio: Q{product.price}</p>
        </div>
    );
}

export default ProductDetails;
