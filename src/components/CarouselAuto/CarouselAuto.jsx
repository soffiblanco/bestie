import React, { useState, useEffect } from 'react';
import './CarouselAuto.css';

const CarouselAuto = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [products, setProducts] = useState([]);

    // Llamada a la API para obtener los 4 productos destacados
    useEffect(() => {
        fetch('http://localhost/apis/CarouselAuto.php')  // Asegúrate de que la URL sea correcta
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setProducts(data.data);
                }
            })
            .catch(error => console.error('Error fetching featured products:', error));
    }, []);

    // Función para avanzar automáticamente
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 3000); // Cambia cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, [products]);

    // Manejar clic en la imagen del producto para redirigir a la página del producto
    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`;  // Redirige a la página individual del producto
    };

    return (
        <div className="carousel-container">
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
                <div className="carousel-message">Cargando productos destacados...</div>
            )}
        </div>
    );
};

export default CarouselAuto;

