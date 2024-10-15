// ProductCarousel.jsx
import React, { useState, useEffect } from 'react';
import OneProduct from './OneProduct'; 
import './ProductCarousel.css'; 
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

// Categorías locales
const localCategories = [
  {
      name: 'Alimento',
      products: [
          { name: 'Perro', title: 'Alimento para Perro', price: 50, image: comidaPerro },
          { name: 'Gato', title: 'Alimento para Gato', price: 45, image: comidaGato },
          { name: 'Peces', title: 'Alimento para Peces', price: 20, image: comidaPeces },
          { name: 'Tortugas', title: 'Alimento para Tortugas', price: 30, image: comidaTortugas },
          { name: 'Aves', title: 'Alimento para Aves', price: 25, image: comidaAves }
      ]
  },
  {
      name: 'Juguetes',
      products: [
          { name: 'Perro', title: 'Juguete para Perro', price: 35, image: juguetePerro },
          { name: 'Gato', title: 'Juguete para Gato', price: 30, image: jugueteGato }
      ]
  },
  {
      name: 'Hogar',
      products: [
          { name: 'Perro', title: 'Cama para Perro', price: 60, image: hogarPerro },
          { name: 'Gato', title: 'Cama para Gato', price: 55, image: hogarGato },
          { name: 'Peces', title: 'Decoración para Pecera', price: 40, image: hogarPeces },
          { name: 'Tortugas', title: 'Hábitat para Tortugas', price: 70, image: hogarTortugas },
          { name: 'Aves', title: 'Jaula para Aves', price: 100, image: hogarAves }
      ]
  },
  {
      name: 'Accesorios',
      products: [
          { name: 'Perro', title: 'Accesorios para Perro', price: 15, image: accesorioPerro },
          { name: 'Gato', title: 'Accesorios para Gato', price: 20, image: accesorioGato }
      ]
  },
  {
      name: 'Medicina',
      products: [
          { name: 'Perro', title: 'Medicina para Perro', price: 25, image: medicinaPerro },
          { name: 'Gato', title: 'Medicina para Gato', price: 20, image: medicinaGato },
          { name: 'Peces', title: 'Medicina para Peces', price: 15, image: medicinaPeces },
          { name: 'Tortugas', title: 'Medicina para Tortugas', price: 30, image: medicinaTortugas },
          { name: 'Aves', title: 'Medicina para Aves', price: 35, image: medicinaAves }
      ]
  },
  {
      name: 'Ropa',
      products: [
          { name: 'Perro', title: 'Ropa para Perro', price: 40, image: ropaPerro },
          { name: 'Gato', title: 'Ropa para Gato', price: 35, image: ropaGato }
      ]
  }
];


const ProductCarousel = ({ numVisibleProducts = 4 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);

    // Utilizamos las categorías locales
    useEffect(() => {
        const allProducts = localCategories.flatMap(category => category.products);
        setProducts(allProducts);
    }, []);

    const handleNext = () => {
        const maxIndex = products.length - numVisibleProducts;
        setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
    };

    const handlePrev = () => {
        const maxIndex = products.length - numVisibleProducts;
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
    };

    const visibleProducts = products.slice(currentIndex, currentIndex + numVisibleProducts);

    return (
        <div className="carousel-container">
            <button className="carousel-button prev-button" onClick={handlePrev}>
                ◀
            </button>

            <div className="carousel-content">
                {visibleProducts.map((product, index) => (
                    <OneProduct 
                        key={index}
                        title={product.name}
                        description={product.description || 'Descripción no disponible'}
                        price={product.price || 'N/A'}
                        image={product.image}
                    />
                ))}
            </div>

            <button className="carousel-button next-button" onClick={handleNext}>
                ▶
            </button>
        </div>
    );
};

export default ProductCarousel;


