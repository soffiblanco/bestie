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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
        setIsMenuOpen(false);
    };

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
                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`} onClick={() => handleItemClick(item)}>
                            {item}
                        </Link>
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

