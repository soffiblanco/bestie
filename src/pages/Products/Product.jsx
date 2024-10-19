import React, { useContext, useEffect, useState } from 'react';
import './Product.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import { useNavigate } from 'react-router-dom';

function Product({ productId, title, description, price, image }) {
    const { addProductToOrder } = useContext(OrderContext);
    const navigate = useNavigate();

    const handleAddToOrder = () => {
        const product = {
            id: productId,
            title,
            price,
            image,
        };
        addProductToOrder(product); // Agrega el producto a la orden
    };

    const handleViewDetails = () => {
        navigate(`/product/${productId}`); // Redirige a la página individual del producto
    };

    return (
        <div className='container-product'>
            <img 
                className='image-product'
                src={image}  // Usamos la imagen directamente de la API
                alt={title}
            />

            <div className='info-product'>
                <p className='title'>{title}</p>
                <p className='description'>{description}</p>
                <p className='price'>Q{price}</p>
                <button className='see-details' onClick={handleViewDetails}>
                    Ver más detalles
                </button>
                <button className='see-more' onClick={handleAddToOrder}>
                    Agregar a la Orden
                </button>
            </div>
        </div>
    );
}

export default Product;
