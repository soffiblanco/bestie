// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import './NavBar.css';
import { IoSearchSharp, IoMenuSharp } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Link } from 'react-router-dom';
import Paws from '../../assets/Paws.png';
import { TiShoppingCart } from "react-icons/ti";
import { FaUserPlus, FaUser } from "react-icons/fa";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('Home');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(null); // Controla qué categoría está desplegada
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const categoriesRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        // Cerrar todos los menús cuando se hace clic en cualquier opción
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
        setIsUserMenuOpen(false);
        setOpenCategory(null); // Cierra cualquier subcategoría abierta
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const toggleCategories = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    const toggleSubcategories = (categoryName) => {
        setOpenCategory(openCategory === categoryName ? null : categoryName);
    };

    // Cierra el menú de categorías si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
                setIsCategoriesOpen(false);
                setOpenCategory(null); // Cierra cualquier subcategoría abierta
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cierra el menú de usuarios si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const categories = [
        {
            name: 'Food',
            subcategories: [
                { name: 'Dog', path: '/categories/food/dog' },
                { name: 'Cat', path: '/categories/food/cat' },
                { name: 'Fish', path: '/categories/food/fish' },
                { name: 'Turtles', path: '/categories/food/turtles' },
                { name: 'Birds', path: '/categories/food/birds' }
            ]
        },
        {
            name: 'Toys',
            subcategories: [
                { name: 'Dog', path: '/categories/toys/dog' },
                { name: 'Cat', path: '/categories/toys/cat' }
            ]
        },
        {
            name: 'Home',
            subcategories: [
                { name: 'Dog', path: '/categories/home/dog' },
                { name: 'Cat', path: '/categories/home/cat' },
                { name: 'Fish', path: '/categories/home/fish' },
                { name: 'Turtles', path: '/categories/home/turtles' },
                { name: 'Birds', path: '/categories/home/birds' }
            ]
        },
        {
            name: 'Accessories',
            subcategories: [
                { name: 'Dog', path: '/categories/accessories/dog' },
                { name: 'Cat', path: '/categories/accessories/cat' }
            ]
        },
        {
            name: 'Medicine',
            subcategories: [
                { name: 'Dog', path: '/categories/medicine/dog' },
                { name: 'Cat', path: '/categories/medicine/cat' },
                { name: 'Fish', path: '/categories/medicine/fish' },
                { name: 'Turtles', path: '/categories/medicine/turtles' },
                { name: 'Birds', path: '/categories/medicine/birds' }
            ]
        },
        {
            name: 'Clothing',
            subcategories: [
                { name: 'Dog', path: '/categories/clothing/dog' },
                { name: 'Cat', path: '/categories/clothing/cat' }
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
                {['Home', 'About Us', 'Orders', 'Login'].map((item) => (
                    <li key={item}
                        onClick={() => handleItemClick(item)}
                        className={activeItem === item ? 'active' : ''}>
                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`}>{item}</Link>
                    </li>
                ))}
                <li className={activeItem === 'Categories' ? 'active' : ''}>
                    <div className="categories-container">
                        <Link to="/categories" onClick={() => handleItemClick('Categories')}>
                            Categories
                        </Link>
                        {isCategoriesOpen ? (
                            <IoIosArrowUp className="categories-toggle-icon" onClick={toggleCategories} />
                        ) : (
                            <IoIosArrowDown className="categories-toggle-icon" onClick={toggleCategories} />
                        )}
                    </div>
                    {isCategoriesOpen && (
                        <ul className="dropdown" ref={categoriesRef}>
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <div className="category-item">
                                        <Link to={`/categories/${category.name.toLowerCase()}`} onClick={() => handleItemClick(category.name)}>
                                            {category.name}
                                        </Link>
                                        {openCategory === category.name ? (
                                            <IoIosArrowUp className="subcategories-toggle-icon" onClick={() => toggleSubcategories(category.name)} />
                                        ) : (
                                            <IoIosArrowDown className="subcategories-toggle-icon" onClick={() => toggleSubcategories(category.name)} />
                                        )}
                                    </div>
                                    {openCategory === category.name && (
                                        <ul className="sub-dropdown">
                                            {category.subcategories.map((sub) => (
                                                <li key={sub.name}>
                                                    <Link to={sub.path} onClick={() => handleItemClick(sub.name)}>{sub.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
                <div className='icon-container' ref={userMenuRef}>
                    <div className='search-icon' onClick={() => handleItemClick('Cart')}>
                        <TiShoppingCart size={30} />
                    </div>
                    <div className='search-icon' onClick={toggleUserMenu}>
                        <FaUserPlus size={25} />
                        {isUserMenuOpen && (
                            <ul className="dropdown user-dropdown">
                                <li><Link to="/users" onClick={() => handleItemClick('Users')}>Users</Link></li>
                                <li><Link to="/categories" onClick={() => handleItemClick('Categories')}>Categories</Link></li>
                                <li><Link to="/subcategories" onClick={() => handleItemClick('Subcategories')}>Subcategories</Link></li>
                                <li><Link to="/products" onClick={() => handleItemClick('Products')}>Products</Link></li>
                            </ul>
                        )}
                    </div>
                    <div className='search-icon' onClick={() => handleItemClick('User')}>
                        <FaUser size={20} />
                    </div>
                </div>
            </ul>

            <img src={Paws} alt='paws' className='Paws' />
        </div>
    );
};

export default Navbar;
