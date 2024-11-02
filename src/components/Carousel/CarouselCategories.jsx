import React, { useState, useEffect } from 'react';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Carousel.css';
import { useNavigate } from 'react-router-dom';

const CarouselCategories = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Llamada a la API para obtener los 5 productos más recientes con categoría y subcategoría
    useEffect(() => {
        fetch('http://localhost/apis/CarouselCategories.php')  // URL de la API actualizada
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
                        onClick={() => handleProductClick(products[currentProductIndex])}
                    >
                        <div className="carousel-title">
                            {products[currentProductIndex].Product_Name}
                        </div>
                    </div>
                ) : (
                    <div className="carousel-message">Loading recent products...</div>
                )}
            </div>
            <button onClick={nextProduct} className="carousel-button right">
                <GoChevronRight size={30} />
            </button>
        </div>
    );
};

export default CarouselCategories;
