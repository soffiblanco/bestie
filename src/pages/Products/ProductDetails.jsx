import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FaBagShopping } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './ProductDetails.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; 

const ProductDetails = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    const { addProductToOrder } = useContext(OrderContext); // Usar la función para agregar el producto al carrito

    useEffect(() => {
        fetch(`http://localhost/apis/products.php?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching product details');
                }
                return response.json();
            })
            .then(data => {
                console.log('Producto obtenido:', data);
                const foundProduct = data.data.find(item => item.ID_Product === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError('Producto no encontrado.');
                }
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                setError('Error al obtener los detalles del producto.');
            });
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            // Añadir el producto al carrito usando la función del contexto
            addProductToOrder({
                id: product.ID_Product,
                title: product.Product,
                price: product.Price,
                image: product.Product_Image,
                quantity: 1, // Inicia con cantidad 1
            });
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!product) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando detalles del producto...</span>
        </div>;
    }

    return (
        <div className="containerProduct mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.Product_Image} alt={product.Product} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <h2 className="my-3">{product.Product}</h2>
                    <p className="h6">{product.Product_Description}</p>
                    <p className="h5">Price: ${product.Price}</p>
                    <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
                        <FaBagShopping className="me-2"/> Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
