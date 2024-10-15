// CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Mosaic.css';
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
import { MdOutlineAutoAwesomeMosaic } from 'react-icons/md';

// Datos simulados para las categorías y productos
const categoriesData =  [
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



const Mosaic = () => {
    const [categories, setCategories] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        // Inicializar las categorías
        setCategories(categoriesData);

        // Cambiar automáticamente la imagen de todas las categorías al mismo tiempo
        const intervalId = setInterval(() => {
            setImageIndex(prevIndex => (prevIndex + 1) % categoriesData[0].products.length);
        }, 3000); // Cambiar la imagen cada 3 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
        <div className="categories-grid">
            {categories.map((category, index) => (
                <Link to={`/categories/${category.name.toLowerCase()}`} key={index} className="category-item">
                    <div
                        className="category-image"
                        style={{
                            backgroundImage: `url(${category.products[imageIndex % category.products.length].image})`
                        }}
                    >
                        <div className="category-name">{category.name}</div>
                    </div>
                </Link>
            ))}
        </div>
        
        </div>
    );
};

export default Mosaic;
