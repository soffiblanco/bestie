import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { TiShoppingCart } from 'react-icons/ti';
import { FaUser, FaUserPlus } from 'react-icons/fa';
import Paws from '../../assets/Paws.png';
import 'bootstrap/dist/css/bootstrap.min.css';  
import './NavBar.css';  
import {useAuth} from '../../Auth/AuthContext.js';
import HasPermission from '../../Auth/HasPermission';


const Navbar = () => {


  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();
  const {userData} = useAuth();
  
  const handleItemClick = (item) => {
    setIsCategoriesOpen(false);
    setIsUserMenuOpen(false);
    setOpenCategory(null);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const toggleSubcategories = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/CatalogProducts/${categoryName.toLowerCase()}`);
    setIsCategoriesOpen(false);
    setOpenCategory(null);
  };

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    navigate(`/CatalogProducts/${categoryName.toLowerCase()}/${subcategoryName.toLowerCase()}`);
    setIsCategoriesOpen(false);
    setOpenCategory(null);
  };

  const goToOrder = () => {
    navigate('/Order');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
        setOpenCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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




    if(!userData){

      <li className="nav-item">
        <Link className="nav-link" to="/login" onClick={() => handleItemClick('Login')}>Login</Link>
      </li>
    }

    <>
      <div className="d-flex align-items-center" ref={userMenuRef}>
        <div className="nav-link" onClick={goToOrder}>
          <TiShoppingCart size={30} />
        </div>
      </div>
    </>


  const categories = [
    { name: 'Food', subcategories: ['Dog', 'Cat', 'Fish', 'Turtles', 'Birds'] },
    { name: 'Toys', subcategories: ['Dog', 'Cat'] },
    { name: 'Home', subcategories: ['Dog', 'Cat', 'Fish', 'Turtles', 'Birds'] },
    { name: 'Accessories', subcategories: ['Dog', 'Cat'] },
    { name: 'Medicine', subcategories: ['Dog', 'Cat', 'Fish', 'Turtles', 'Birds'] },
    { name: 'Clothing', subcategories: ['Dog', 'Cat'] },
  ];

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className='nav-item'>
              <Link className="navbar-brand" to="/home">
                <img src={Paws} alt="Paws" width="30" height="30" />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about-us" onClick={() => handleItemClick('About Us')}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={() => handleItemClick('Orders')}>Orders</Link>
            </li>

            {/* Dropdown para categorías */}
            <li className="nav-item dropdown">
              <div className="d-flex align-items-center">
                {/* Enlace que redirige a la página de categorías */}
                <Link
                  to="/categories"
                  className="nav-link"
                  onClick={() => handleItemClick('Categories')}
                >
                  Categories
                </Link>
                {/* Flecha que despliega las categorías */}
                <a
                  className="nav-link"
                  href="#"
                  role="button"
                  aria-expanded={isCategoriesOpen}
                  onClick={(e) => {
                    e.preventDefault(); // Prevenir la redirección cuando se hace clic en la flecha
                    toggleCategories();  // Lógica personalizada
                  }}
                >
                  {isCategoriesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </a>
              </div>

              
{/* Menú desplegable personalizado */}
<ul className={`dropdown-menu ${isCategoriesOpen ? 'show' : ''}`}>
  {categories.map((category) => (
    <li key={category.name}>
      <div className="d-flex justify-content-between align-items-center">
        {/* Redirecciona a la página de la categoría cuando se hace clic en el nombre de la categoría */}
        <span
          className="dropdown-item"
          onClick={() => handleCategoryClick(category.name)}  
        >
          {category.name}
        </span>
        {/* Flecha que despliega las subcategorías */}
        <span
          className="dropdown-item"
          onClick={() => toggleSubcategories(category.name)}  
        >
          {openCategory === category.name ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </span>
      </div>

      {/* Menú de subcategorías */}
      {openCategory === category.name && (
        <ul className="dropdown-submenu">
          {category.subcategories.map((sub) => (
            <li key={sub}>
              <div
                className="dropdown-item"
                onClick={() => handleSubcategoryClick(category.name, sub)}  
              >
                {sub}
              </div>
            </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
            </li>
        
          {
              !userData &&
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={() => handleItemClick('Login')}>Login</Link>
              </li>
          }
        
          </ul>

          <div className="d-flex align-items-center" ref={userMenuRef}>
            <div className="nav-link" onClick={goToOrder}>
              <TiShoppingCart size={30} />
            </div>

        
          <HasPermission permission ="Admin Categories" action="View">
          
            <div className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle"
                id="userMenu"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUserPlus size={25} />
              </div>
          
              <ul className="dropdown-menu" aria-labelledby="userMenu">
            
              
              <HasPermission permission="Admin User ">
                  <li>
                    <Link to="/users" className="dropdown-item">Users</Link>
                  </li>
              </HasPermission>
          
                <li><Link to="/categoriesp" className="dropdown-item">Categories P</Link></li>
                <li><Link to="/subcategories" className="dropdown-item">Subcategories</Link></li>
                <li><Link to="/products" className="dropdown-item">Products</Link></li>
              </ul>
            </div>
          
            </HasPermission>
        
          
            <div className="nav-link" onClick={goToProfile}>
              <FaUser size={20} />
            </div>
          </div>
         

          <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
