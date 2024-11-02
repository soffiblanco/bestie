import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CatalogProducts.css';
import { useNavigate, useParams } from 'react-router-dom';

const CatalogProducts = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { category } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost/apis/category_subcategory_unique_view.php?category=${category}`) 
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    setSubcategories(data.data);
                } else {
                    setError('Datos de subcategorías inválidos');
                }
                setLoading(false);
            })
            .catch((error) => {
                setError('Error al obtener las subcategorías');
                setLoading(false);
            });
    }, [category]);

    const handleSubcategoryClick = (subcategoryName) => {
        navigate(`/CatalogProducts/${category}/${subcategoryName}`);
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="catalog-container">
            <h1>{category} subcategories</h1>
            <div className="categories-grid">
                {subcategories.map((subcategory) => (
                    <div 
                        key={subcategory.ID_Subcategory} 
                        className="category-card" 
                        onClick={() => handleSubcategoryClick(subcategory.Subcategory)}
                    >
                        <img src={subcategory.Subcategory_Image} alt={subcategory.Subcategory} className="category-image"/>
                        <h3>{subcategory.Subcategory}</h3>
                        <p>{subcategory.Subcategory_Description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogProducts;

