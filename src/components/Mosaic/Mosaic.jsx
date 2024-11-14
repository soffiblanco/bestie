import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mosaic.css';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const Mosaic = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
       ecommerce_fetch(`${baseUrl}/Mosaic.php`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    setCategories(data.data);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/catalogProducts/${categoryId}`);
    };

    return (
        <div className="mosaic-wrapper">
            <div className="mosaic-grid">
                {categories.map((category) => (
                    <div
                        key={category.ID_Category}
                        className="mosaic-category-item"
                        onClick={() => handleCategoryClick(category.Category)}
                    >
                        <div
                            className="mosaic-category-image"
                            style={{
                                backgroundImage: `url(${category.Product_Image})`
                            }}
                        >
                            <div className="mosaic-category-name">{category.Category}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mosaic;



