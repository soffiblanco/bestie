// src/components/ProductCarousel.jsx
import React, { useState, useEffect } from 'react';
import './ProductCarousel.css'; // Asegúrate de que la ruta sea correcta

const ProductCarousel = ({ categories, numProducts = 5, interval = 3000 }) => {
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    // Al cargar el componente, selecciona productos aleatorios de las categorías
    const selectedProducts = getRandomProducts(categories, numProducts);
    setRandomProducts(selectedProducts);

    // Inicia el intervalo de scroll automático
    const intervalId = setInterval(() => {
      setRandomProducts(getRandomProducts(categories, numProducts)); // Refresca los productos aleatorios en cada intervalo
    }, interval);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, [categories, numProducts, interval]);

  return (
    <div className="carousel-container">
      <div
        className="carousel-images"
        style={{
          display: 'flex',
          transform: `translateX(-${randomProducts.length > 0 ? 100 : 0}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {randomProducts.map((product, index) => (
          <div key={index} className="product-card" style={{ width: '100%', flexShrink: 0 }}>
            <img src={product.image} alt={product.name} style={{ width: '100%' }} />
            <div className="product-info">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Función para seleccionar productos aleatorios
function getRandomProducts(categories, numProducts) {
  let allProducts = categories.flatMap(category => category.products); // Junta todos los productos
  let shuffled = allProducts.sort(() => 0.5 - Math.random()); // Mezcla productos
  return shuffled.slice(0, numProducts); // Selecciona los primeros 'numProducts'
}

export default ProductCarousel;
