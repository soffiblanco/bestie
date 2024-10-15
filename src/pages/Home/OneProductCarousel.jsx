// OneProductCarousel.jsx
import React from 'react';
import { Carousel } from 'react-bootstrap'; // Usamos react-bootstrap
import OneProduct from './OneProduct'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const products = [
    { title: 'Comida Aves', description: 'Comida nutritiva para aves', price: 100, image: 'comidaAves' },
    { title: 'Comida Gato', description: 'Comida deliciosa para gatos', price: 90, image: 'comidaGato' },
    { title: 'Comida Perro', description: 'Comida premium para perros', price: 80, image: 'comidaPerro' },
    { title: 'Accesorio Gato', description: 'Accesorio elegante para gatos', price: 75, image: 'accesorioGato' },
    { title: 'Comida Peces', description: 'Comida especial para peces', price: 50, image: 'comidaPeces' },
];

const OneProductCarousel = () => (
    <Carousel className="product-carousel">
        {products.map((product, index) => (
            <Carousel.Item key={index}>
                <div className="d-flex justify-content-center">
                    <OneProduct
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        image={product.image}
                    />
                </div>
            </Carousel.Item>
        ))}
    </Carousel>
);

export default OneProductCarousel;

