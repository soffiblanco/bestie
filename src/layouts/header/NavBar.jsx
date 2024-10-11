// Navbar.jsx
import React, { useState } from 'react';
import './NavBar.css';
import { IoSearchSharp, IoMenuSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Paws from '../../assets/Paws.png';
import { TiShoppingCart } from "react-icons/ti";
import { FaUserPlus, FaUser } from "react-icons/fa";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Home');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null); // Controla qué categoría está desplegada

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        setIsMenuOpen(false);
    };

    const toggleCategories = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    const toggleSubcategories = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    // Estructura de datos para categorías y subcategorías
    const categories = [
        {
            name: 'Electronics',
            subcategories: [
                { name: 'Laptops', path: '/categories/electronics/laptops' },
                { name: 'Cameras', path: '/categories/electronics/cameras' },
                { name: 'Smartphones', path: '/categories/electronics/smartphones' }
            ]
        },
        {
            name: 'Clothing',
            subcategories: [
                { name: 'Men', path: '/categories/clothing/men' },
                { name: 'Women', path: '/categories/clothing/women' },
                { name: 'Kids', path: '/categories/clothing/kids' }
            ]
        },
        {
            name: 'Books',
            subcategories: [
                { name: 'Fiction', path: '/categories/books/fiction' },
                { name: 'Non-Fiction', path: '/categories/books/non-fiction' },
                { name: 'Comics', path: '/categories/books/comics' }
            ]
        },
        {
            name: 'Sports',
            subcategories: [
                { name: 'Football', path: '/categories/sports/football' },
                { name: 'Tennis', path: '/categories/sports/tennis' },
                { name: 'Running', path: '/categories/sports/running' }
            ]
        }
    ];

    return (
        <div className='NavBar'>
            <div className="menu-toggle" onClick={toggleMenu}>
                <IoMenuSharp />
            </div>

            <div className='search-box'>
                <input type="text" placeholder='Search' />
                <IoSearchSharp className='search-icon' />
            </div>

            <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
                {['Home', 'Categories', 'About Us', 'Orders', 'Login'].map((item) => (
                    <li key={item}
                        onClick={() => handleItemClick(item)}
                        className={activeItem === item ? 'active' : ''}>
                        {item === 'Categories' ? (
                            <>
                                <span onClick={toggleCategories}>Categories</span>
                                {isCategoriesOpen && (
                                    <ul className="dropdown">
                                        {categories.map((category) => (
                                            <li key={category.name}>
                                                <span onClick={() => toggleSubcategories(category.name)}>
                                                    {category.name}
                                                </span>
                                                {openCategory === category.name && (
                                                    <ul className="sub-dropdown">
                                                        {category.subcategories.map((sub) => (
                                                            <li key={sub.name}>
                                                                <Link to={sub.path}>{sub.name}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <Link to={`/${item.toLowerCase().replace(' ', '-')}`} onClick={() => handleItemClick(item)}>
                                {item}
                            </Link>
                        )}
                    </li>
                ))}
                <div className='icon-container'>
                    <div className='search-icon'><TiShoppingCart size={30} /></div>
                    <div className='search-icon'><FaUserPlus size={25} /></div>
                    <div className='search-icon'><FaUser size={20} /></div>
                </div>
            </ul>

            <img src={Paws} alt='paws' className='Paws' />
        </div>
    );
};

export default Navbar;


