// CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import PhotoCard from '../../components/PhotoCard/PhotoCard';
import './Categories.css';
import MosaicCategories from '../../components/Mosaic/MosaicCategories';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);  // Estado para las categorías
    const [imageIndex, setImageIndex] = useState(0);   // Estado para la rotación de imágenes
    const [error, setError] = useState(null);          // Estado para manejar errores

    useEffect(() => {
        
       ecommerce_fetch(`${baseUrl}/recentProducts.php`, { method: 'GET' })  
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                  
                    const categoriesData = data.data.reduce((acc, product) => {
                        const categoryIndex = acc.findIndex(cat => cat.name === product.Category);
                        if (categoryIndex >= 0) {
                            acc[categoryIndex].products.push({
                                name: product.Product,
                                description: product.Product_Description,
                                image: product.Product_Image
                            });
                        } else {
                            acc.push({
                                name: product.Category,
                                products: [{
                                    name: product.Product,
                                    description: product.Product_Description,
                                    image: product.Product_Image
                                }]
                            });
                        }
                        return acc;
                    }, []);
                    
                    setCategories(categoriesData);
                }
            })
            .catch(error => {
                console.error('Error fetching recent products:', error);
                setError('Error fetching recent products');
            });

        // Cambiar automáticamente la imagen de todas las categorías al mismo tiempo
        const intervalId = setInterval(() => {
            setImageIndex(prevIndex => (prevIndex + 1) % 2);  // Asegura que haya al menos 2 imágenes
        }, 3000); // Cambiar la imagen cada 3 segundos

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='categories-design'>
            {/* Componente de la tarjeta de foto */}
            <div className='photoCard-test'>
                <PhotoCard />
            </div>
            
            {/* Componente del carrusel */}
            <div className='carousel-container-categories'>
                <Carousel />
            </div>

     
               <MosaicCategories/>
            
        </div>
    );
};

export default CategoriesPage;





