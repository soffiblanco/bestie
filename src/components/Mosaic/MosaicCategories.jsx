import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Mosaic.css';

const MosaicCategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost/apis/MosaicCategories.php')
            .then(response => response.json())
            .then(data => {
                if (data && data.data) {
                    setSubcategories(data.data);
                }
            })
            .catch(error => console.error('Error fetching subcategories:', error));
    }, []);

    const handleSubcategoryClick = (category, subcategory) => {
        navigate(`/catalogProducts/${category}/${subcategory}`);
    };

    return (
        <div className="mosaic-wrapper">
            <div className="mosaic-grid">
                {subcategories.map((subcategory) => (
                    <div
                        key={subcategory.ID_Product}
                        className="mosaic-category-item mosaic-subcategory-item"
                        onClick={() => handleSubcategoryClick(subcategory.Category, subcategory.Subcategory)}
                    >
                        <div
                            className="mosaic-category-image mosaic-subcategory-image"
                            style={{
                                backgroundImage: `url(${subcategory.Product_Image})`
                            }}
                        >
                            <div className="mosaic-category-name mosaic-subcategory-name">
                                {subcategory.Category} - {subcategory.Subcategory}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MosaicCategories;

