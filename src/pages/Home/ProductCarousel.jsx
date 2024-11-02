import React, { useState, useEffect, useContext } from 'react';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductCarousel.css';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Asegúrate de que la ruta sea correcta
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCarousel = ({ numVisibleProducts = 4 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { category, subcategory } = useParams();
    const { addProductToOrder } = useContext(OrderContext); // Importa la función de agregar al carrito

    useEffect(() => {
        fetch('http://localhost/apis/ProductCard.php')
            .then(response => response.json())
            .then(data => setProducts(data.data || []))
            .catch(error => {
                console.error('Error fetching products:', error);
                setProducts([]);
            });
    }, []);

    const handleNext = () => {
        const maxIndex = Math.max(products.length - numVisibleProducts, 0);
        setCurrentIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
    };

    const handlePrev = () => {
        const maxIndex = Math.max(products.length - numVisibleProducts, 0);
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
    };

    const handleProductClick = (product) => {
        navigate(`/CatalogProducts/${product.Category}/${product.Subcategory}/product/${product.ID_Product}`);
    };

    const handleAddToCart = (product) => {
        addProductToOrder({
            id: product.ID_Product,
            title: product.Product,
            price: product.Price,
            image: product.Product_Image,
            quantity: 1,
        });
        toast.success('Your product has been added to your order');
    };

    const showArrows = products.length > numVisibleProducts;
    const visibleProducts = products.slice(currentIndex, currentIndex + numVisibleProducts);

    return (
        <div className="custom-carousel-container">
            <ToastContainer position="top-right" />
            {showArrows && (
                <button className="custom-carousel-button custom-prev-button" onClick={handlePrev}>
                    <GoChevronLeft />
                </button>
            )}

            <div className="custom-carousel-row">
                {visibleProducts.map((product, index) => (
                    <div key={index} className="custom-carousel-col">
                        <div className="custom-product-card">
                            <div className="custom-image-container" onClick={() => handleProductClick(product)}>
                                <img
                                    src={product.Product_Image}
                                    alt={product.Product}
                                    className="custom-product-image"
                                />
                            </div>
                            <div className="custom-card-body text-center">
                                <h5 className="custom-product-title">{product.Product}</h5>
                                <p className="custom-product-description">{product.Product_Description || 'Descripción no disponible'}</p>
                                <button className="custom-product-icon" onClick={() => handleAddToCart(product)}>
                                    <FaShoppingBag />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showArrows && (
                <button className="custom-carousel-button custom-next-button" onClick={handleNext}>
                    <GoChevronRight />
                </button>
            )}
        </div>
    );
};

export default ProductCarousel;

