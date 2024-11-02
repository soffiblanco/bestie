import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CarouselAuto.css';
import { useNavigate } from 'react-router-dom';

const CarouselAuto = () => {
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Llamada a la API para obtener los productos destacados
    useEffect(() => {
        fetch('http://localhost/apis/CarouselAuto.php') // Asegúrate de que la URL sea correcta
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

    const handleProductClick = (product) => {
        navigate(`/CatalogProducts/${product.Category}/${product.Subcategory}/product/${product.ID_Product}`);
    };

    return (
        <div className="container"> {/* Bootstrap container */}
            {products.length > 0 ? (
                <div
                    className="carousel-image position-relative mb-4"
                    style={{
                        backgroundImage: `url(${products[currentProductIndex].Product_Image})`,
                    }}
                    onClick={() => handleProductClick(products[currentProductIndex])} // Pasa el producto actual
                >
                    <div className="carousel-title text-center">
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


