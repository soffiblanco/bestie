import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Carousel.css';
import { useNavigate } from 'react-router-dom';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const Carousel = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Llamada a la API para obtener los 10 productos más vendidos con categoría y subcategoría
    useEffect(() => {
        ecommerce_fetch(`${baseUrl}/Carousel.php`, { method: 'GET' })  
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setProducts(data.data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Avanzar al siguiente producto en el carrusel
    const nextProduct = () => {
        if (products.length > 0) {
            setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
        }
    };

    // Retroceder al producto anterior en el carrusel
    const prevProduct = () => {
        if (products.length > 0) {
            setCurrentProductIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
        }
    };

    // Manejar clic en la imagen del producto para redirigir a la página del producto
    const handleProductClick = (product) => {
        // Redirige a la página de detalles del producto con categoría y subcategoría en la ruta
        navigate(`/CatalogProducts/${product.Category}/${product.Subcategory}/product/${product.ID_Product}`);
    };

    return (
        <div>
                        <button onClick={prevProduct} className="carousel-button left">
                <GoChevronLeft size={30} />
            </button>
        <div className="carousel-container position-relative d-flex align-items-center justify-content-center">

            {products.length > 0 ? (
                <div
                    className="carousel-image"
                    style={{
                        backgroundImage: `url(${products[currentProductIndex].Product_Image})`,
                    }}
                    onClick={() => handleProductClick(products[currentProductIndex])}  // Redirige al hacer clic en la imagen
                >
                    <div className="carousel-title">
                        {products[currentProductIndex].Product_Name}
                    </div>
                </div>
            ) : (
                <div className="carousel-message">Cargando productos...</div>  // Mensaje mientras se cargan los productos
            )}
        </div>
        <button onClick={nextProduct} className="carousel-button right">
                <GoChevronRight size={30} />
            </button>
</div>
    );
};

export default Carousel;
