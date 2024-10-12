// Carousel.jsx
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
            { name: 'Gato grande', description: 'Gato grande', image: gatoGrande },
            { name: 'Gato pequeño', description: 'Gato pequeño', image: gatoPequeño },
        ],
    },
    {
        name: 'Perros',
        products: [
            { name: 'Perro grande', description: 'Perro grande', image: perroGrande },
            { name: 'Perro pequeño', description: 'Perro pequeño', image: perroPequeño },
        ],
    },
    {
        name: 'Roedores',
        products: [
            { name: 'Hamster', description: 'Hamster', image: hamster },
            { name: 'Conejo', description: 'Conejo', image: conejo },
        ],
    },
    {
        name: 'Perros',
        products: [
            { name: 'Perro grande', description: 'Perro grande', image: perroGrande },
            { name: 'Perro pequeño', description: 'Perro pequeño', image: perroPequeño },
        ],
    },
    {
        name: 'Roedores',
        products: [
            { name: 'Hamster', description: 'Hamster', image: hamster },
            { name: 'Conejo', description: 'Conejo', image: conejo },
        ],
    },
];

const Carousel = () => {
    const [categories, setCategories] = useState([]);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    useEffect(() => {
        // Inicializar las categorías
        setCategories(categoriesData);
    }, []);

    // Función para avanzar al siguiente producto en el carrusel
    const nextProduct = () => {
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % categoriesData.length);
    };

    // Función para retroceder al producto anterior en el carrusel
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
            <div className="carousel-caption">
                <h3>{categoriesData[currentProductIndex].name}</h3>
                <p>{categoriesData[currentProductIndex].products[0].description}</p>
            </div>
        </div>
        <button onClick={nextProduct} className="carousel-button">›</button>
    </div> 
    
    );
};

export default Carousel;

