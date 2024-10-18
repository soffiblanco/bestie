import React, { useContext } from 'react';
import './OneProduct.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import { FaShoppingBag } from "react-icons/fa";

function Product(props) {
    const { addProductToOrder } = useContext(OrderContext); // Usa el contexto

    const handleAddToOrder = () => {
        const product = {
            title: props.title,
            price: props.price,
            image: props.image,
        };
        addProductToOrder(product); // Agrega el producto a la orden
    };

    return (
        <div className='container-product'>
            <img 
                className='image-product'
                src={props.image}  // La imagen viene directamente en base64 desde la API
                alt={props.title}
            />

            <div className='info-product'>
                <p className='title'>{props.title}</p>
                <p className='description'>{props.description}</p>
                <p className='price'>Q{props.price}</p>
                <button className='see-more' onClick={handleAddToOrder}>
                <FaShoppingBag />
                </button>
            </div>
        </div>
    );
}

export default Product;
