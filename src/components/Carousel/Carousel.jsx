import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [products, setProducts] = useState([]);

    // Llamada a la API para obtener los 10 productos más vendidos
    useEffect(() => {
        fetch('http://localhost/apis/Carousel.php')  // Asegúrate de que la URL sea correcta
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
    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`;  // Redirige a la página individual del producto
    };

    return (
        <div className="carousel-container">
            <button onClick={prevProduct} className="carousel-button">‹</button>
            {products.length > 0 ? (
                <div
                    className="carousel-image"
                    style={{
                        backgroundImage: `url(${products[currentProductIndex].Product_Image})`,
                    }}
                    onClick={() => handleProductClick(products[currentProductIndex].ID_Product)}  // Redirige al hacer clic en la imagen
                >
                    <div className="carousel-title">
                        {products[currentProductIndex].Product_Name}
                    </div>
                </div>
            ) : (
                <div className="carousel-message">Cargando productos...</div>  // Mensaje mientras se cargan los productos
            )}
            <button onClick={nextProduct} className="carousel-button">›</button>
        </div>
    );
};

export default Carousel;
