// CarouselAuto.jsx
import React, { useState, useEffect } from 'react';
import './CarouselAuto.css';
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

const CarouselAuto = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);

    // Función para avanzar automáticamente
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProductIndex((prevIndex) => (prevIndex + 1) % categoriesData.length);
        }, 3000); // Cambia cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    return (
        <div className="carousel-container">
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
        </div>
    );
};

export default CarouselAuto;
