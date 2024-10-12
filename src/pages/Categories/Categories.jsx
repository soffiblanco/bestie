// CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';
import conejo from '../../assets/conejo.jpeg';
import gatoGrande from '../../assets/gatoGrande.jpeg';
import gatoPequeño from '../../assets/gatoPequeño.jpeg';
import hamster from '../../assets/hamster.jpeg';
import perroGrande from '../../assets/perroGrande.jpeg';
import perroPequeño from '../../assets/perroPequeño.jpeg';
import Carousel from '../../components/Carousel/Carousel';
import PhotoCard from '../../components/PhotoCard/PhotoCard';

// Datos simulados para las categorías y productos
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



const CategoriesPage = () => {
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
         <PhotoCard/>
         <Carousel/>
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

export default CategoriesPage;




