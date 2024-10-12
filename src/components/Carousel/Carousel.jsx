import React, { useState, useEffect } from 'react';
import './Carousel.css';
import conejo from '../../assets/conejo.jpeg';
import gatoGrande from '../../assets/gatoGrande.jpeg';
import gatoPequeño from '../../assets/gatoPequeño.jpeg';
import hamster from '../../assets/hamster.jpeg';
import perroGrande from '../../assets/perroGrande.jpeg';
import perroPequeño from '../../assets/perroPequeño.jpeg';

const categoriesData = [
    {
        name: 'Gatos',
        products: [
            { name: 'Gato grande', image: gatoGrande },
            { name: 'Gato pequeño', image: gatoPequeño },
        ],
    },
    {
        name: 'Perros',
        products: [
            { name: 'Perro grande', image: perroGrande },
            { name: 'Perro pequeño', image: perroPequeño },
        ],
    },
    {
        name: 'Roedores',
        products: [
            { name: 'Hamster', image: hamster },
            { name: 'Conejo', image: conejo },
        ],
    },
];

const Carousel = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    // Avanzar al siguiente producto en el carrusel
    const nextProduct = () => {
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % categoriesData.length);
    };

    // Retroceder al producto anterior en el carrusel
    const prevProduct = () => {
        setCurrentProductIndex((prevIndex) => (prevIndex - 1 + categoriesData.length) % categoriesData.length);
    };

    return (
        <div className="carousel-container">
            <button onClick={prevProduct} className="carousel-button">‹</button>
            <div
                className="carousel-image"
                style={{
                    backgroundImage: `url(${categoriesData[currentProductIndex].products[0].image})`,
                }}
            >
                <div className="carousel-title">
                    {categoriesData[currentProductIndex].name}
                </div>
            </div>
            <button onClick={nextProduct} className="carousel-button">›</button>
        </div>
    );
};

export default Carousel;

