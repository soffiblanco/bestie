import React, { useState, useEffect } from 'react';
import OneProduct from './OneProduct'; 
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCarousel.css';


const ProductCarousel = ({ numVisibleProducts = 4 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Llamada a la API para obtener los productos con bajo stock
    useEffect(() => {
        fetch('http://localhost/apis/ProductCard.php')
            .then(response => response.json())
            .then(data => setProducts(data.data))
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

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Si hay menos o igual productos que el número visible, mostrar todos sin flechas
    const showArrows = products.length > numVisibleProducts;
    const visibleProducts = products.slice(currentIndex, currentIndex + numVisibleProducts);

    return (
        <div className="container">
            <div className="row align-items-center justify-content-center position-relative">
                {showArrows && (
                    <button className="btn btn-outline-primary carousel-button prev-button" onClick={handlePrev}>
                        <GoChevronLeft />
                    </button>
                )}

                <div className="col-10">
                    <div className="row gx-4">
                        {visibleProducts.map((product, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-3 mb-4">
                                <div className="card product-card" onClick={() => handleProductClick(product.ID_Product)}>
                                    <div className="image-container">
                                        <img
                                            src={product.Product_Image}
                                            alt={product.Product}
                                            className="product-image"
                                        />
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="product-title">{product.Product}</h5>
                                        <p className="product-description">{product.Product_Description || 'Descripción no disponible'}</p>
                                        <button className="btn btn-outline-light product-icon">
                                            <i className="bi bi-cart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showArrows && (
                    <button className="btn btn-outline-primary carousel-button next-button" onClick={handleNext}>
                        <GoChevronRight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCarousel;

