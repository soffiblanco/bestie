import React, { useContext } from 'react';
import './OneProduct.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Para navegar al detalle del producto

function Product(props) {
    const { addProductToOrder } = useContext(OrderContext); // Usa el contexto
    const navigate = useNavigate(); 

    const handleProductClick = () => {
        navigate(`/product/${props.id}`); // Navega a la vista individual del producto usando el id
    };

    return (
        <div className='container-product' > 
            <img 
                className='image-product'
                src={props.image}  
                alt={props.title}
            />

            <div className='info-product'>
                <p className='title'>{props.title}</p>
                <p className='description'>{props.description}</p>
                <p className='price'>Q{props.price}</p>
                <button className='see-more' onClick={handleProductClick}> 
                    <FaShoppingBag />
                </button>
            </div>
        </div>
    );
}

export default Product;

