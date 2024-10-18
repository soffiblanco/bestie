import React, { useState, useEffect } from 'react';
import OneProduct from './OneProduct'; 
import './ProductCarousel.css'; 
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const ProductCarousel = ({ numVisibleProducts = 4 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);

    // Llamada a la API para obtener los productos con bajo stock
    useEffect(() => {
        fetch('http://localhost/apis/ProductCard.php')  // Cambia la URL si es necesario
            .then(response => response.json())
            .then(data => setProducts(data.data)) // Asume que los productos vienen en data.data
            .catch(error => console.error('Error fetching products:', error));
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
            <GoChevronLeft />
            </button>

            <div className="carousel-content">
                {visibleProducts.map((product, index) => (
                    <OneProduct 
                        key={index}
                        title={product.Product}  // Cambia los nombres de acuerdo a los campos de la API
                        description={product.Product_Description || 'Descripción no disponible'}
                        price={product.Price || 'N/A'}
                        image={product.Product_Image}  // La imagen ya viene en formato base64 desde la API
                    />
                ))}
            </div>

            <button className="carousel-button next-button" onClick={handleNext}>
            <GoChevronRight />
            </button>
        </div>
    );
};

export default ProductCarousel;


