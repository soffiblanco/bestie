import React, { useState } from 'react';
import './NavBar.css';
import { IoSearchSharp, IoMenuSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Paws from '../../assets/Paws.png';

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

            <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
                {['Home', 'Blog', 'About Us', 'Login', 'Sign Up'].map((item) => (
                    <li key={item}
                        onClick={() => handleItemClick(item)}
                        className={activeItem === item ? 'active' : ''}
                    >
                        <Link to={`/${item.toLowerCase().replace(' ', '-')}`} onClick={() => handleItemClick(item)}>
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>

            <img src={Paws} alt='paws' className='Paws'/>

            <div className='search-box'>
                <input type="text" placeholder='Search' />
                <IoSearchSharp className='search-icon' />
            </div>
        </div>
    );
}

export default Navbar;
