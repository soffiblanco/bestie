// Product.jsx
import React, { useContext } from 'react';
import './OneProduct.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import comidaAves from '../../assets/comidaAves.jpeg';
import comidaGato from '../../assets/comidaGato.jpeg';
import comidaPerro from '../../assets/comidaPerro.jpeg';
import comidaPeces from '../../assets/comidaPeces.jpeg';
import comidaTortugas from '../../assets/comidaTortugas.jpeg';
import accesorioGato from '../../assets/accesorioGato.jpeg';

const images = {
    comidaAves,
    comidaGato,
    comidaPerro,
    comidaPeces,
    comidaTortugas,
    accesorioGato
};

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
                src={images[props.image]}
                alt='foto'
            />

            <div className='info-product'>
                <p className='title'>{props.title}</p>
                <p className='description'>{props.description}</p>
                <p className='price'>Q{props.price}</p>
                <button className='see-more' onClick={handleAddToOrder}>
                    Agregar a la Orden
                </button>
            </div>
        </div>
    );
}

export default Product;