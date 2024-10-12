import React, { useState, useEffect } from 'react';
import './PhotoCard.css';
import accesorioGato from '../../assets/accesorioGato.jpeg';
import accesorioPerro from '../../assets/accesorioPerro.jpeg';
import comidaAves from '../../assets/comidaAves.jpeg';
import comidaGato from '../../assets/comidaGato.jpeg';
import comidaPeces from '../../assets/comidaPeces.jpeg';
import comidaPerro from '../../assets/comidaPerro.jpeg';
import comidaTortugas from '../../assets/comidaTortugas.jpeg';
import hogarAves from '../../assets/hogarAves.jpeg';
import hogarGato from '../../assets/hogarGato.jpeg';
import hogarPeces from '../../assets/hogarPeces.jpeg';
import hogarPerro from '../../assets/hogarPerro.jpeg';
import hogarTortugas from '../../assets/hogarTortugas.jpeg';
import jugueteGato from '../../assets/jugueteGato.jpeg';
import juguetePerro from '../../assets/juguetePerro.jpeg';
import medicinaAves from '../../assets/medicinaAves.jpeg';
import medicinaGato from '../../assets/medicinaGato.jpeg';
import medicinaPeces from '../../assets/medicinaPeces.jpeg';
import medicinaPerro from '../../assets/medicinaPerro.jpeg';
import medicinaTortugas from '../../assets/medicinaTortugas.jpeg';
import ropaGato from '../../assets/ropaGato.jpeg';
import ropaPerro from '../../assets/ropaPerro.jpeg';

// Datos de categorías con productos e imágenes
const categories = [
    {
        name: 'Alimento',
        products: [
            { name: 'Perro', image: comidaPerro },
            { name: 'Gato', image: comidaGato },
            { name: 'Peces', image: comidaPeces },
            { name: 'Tortugas', image: comidaTortugas },
            { name: 'Aves', image: comidaAves }
        ]
    },
    {
        name: 'Juguetes',
        products: [
            { name: 'Perro', image: juguetePerro },
            { name: 'Gato', image: jugueteGato }
        ]
    },
    {
        name: 'Hogar',
        products: [
            { name: 'Perro', image: hogarPerro },
            { name: 'Gato', image: hogarGato },
            { name: 'Peces', image: hogarPeces },
            { name: 'Tortugas', image: hogarTortugas },
            { name: 'Aves', image: hogarAves }
        ]
    },
    {
        name: 'Accesorios',
        products: [
            { name: 'Perro', image: accesorioPerro },
            { name: 'Gato', image: accesorioGato }
        ]
    },
    {
        name: 'Medicina',
        products: [
            { name: 'Perro', image: medicinaPerro },
            { name: 'Gato', image: medicinaGato },
            { name: 'Peces', image: medicinaPeces },
            { name: 'Tortugas', image: medicinaTortugas },
            { name: 'Aves', image: medicinaAves }
        ]
    },
    {
        name: 'Ropa',
        products: [
            { name: 'Perro', image: ropaPerro },
            { name: 'Gato', image: ropaGato }
        ]
    }
];

const PhotoCard = () => {
    const [categoryImages, setCategoryImages] = useState({});

    useEffect(() => {
        const initializeImages = () => {
            const initialImages = categories.reduce((acc, category) => {
                const randomProduct = getRandomProduct(category.products);
                acc[category.name] = randomProduct.image;
                return acc;
            }, {});
            setCategoryImages(initialImages);
        };

        initializeImages();

        const interval = setInterval(() => {
            setCategoryImages((prevImages) => {
                const newImages = { ...prevImages };
                categories.forEach((category) => {
                    const randomProduct = getRandomProduct(category.products);
                    newImages[category.name] = randomProduct.image;
                });
                return newImages;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getRandomProduct = (products) => {
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    };

    return (
        <div className="photo-card">
            {categories.map((category, index) => (
                <div key={index} className="photo-card-item">
                    <h3 className="photo-card-category-title">{category.name}</h3>
                    <img
                        src={categoryImages[category.name]}
                        alt={category.name}
                        className="photo-card-category-image"
                    />
                </div>
            ))}
        </div>
    );
    
};

export default PhotoCard;





