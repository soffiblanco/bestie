import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
        
        const ProductDetails = () => {
            const { id } = useParams(); 
            const [product, setProduct] = useState(null);
            const [error, setError] = useState(null); // Añadido para manejar errores
        
            useEffect(() => {
                // Llamada a la API
                fetch(`http://localhost/apis/products.php?id=${id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching product details');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Producto obtenido:', data); // Verifica qué está devolviendo la API
                        const foundProduct = data.data.find(item => item.ID_Product === id);
                        if (foundProduct) {
                            setProduct(foundProduct); // Establecer el producto específico
                        } else {
                            setError('Producto no encontrado.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching product details:', error);
                        setError('Error al obtener los detalles del producto.');
                    });
            }, [id]);
        
            if (error) {
                return <div>{error}</div>;
            }
        
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
        
