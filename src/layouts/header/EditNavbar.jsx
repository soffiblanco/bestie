import React, { useState } from "react";
import "./EditNavbar.css";
import { FaTrashAlt } from "react-icons/fa";

const EditNavbar = () => {
  // Datos iniciales del navbar
  const [navbarSections, setNavbarSections] = useState([
    { id: 1, name: "About Us", link: "/about-us", isVisible: true },
    { id: 2, name: "Orders", link: "/orders", isVisible: true },
    { id: 3, name: "Login", link: "/login", isVisible: true },
  ]);

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Food",
      subcategories: [
        { id: 1, name: "Dog", isVisible: true },
        { id: 2, name: "Cat", isVisible: true },
        { id: 3, name: "Fish", isVisible: true },
        { id: 4, name: "Turtles", isVisible: true },
        { id: 5, name: "Birds", isVisible: true },
      ],
      isVisible: true,
    },
    {
      id: 2,
      name: "Toys",
      subcategories: [
        { id: 6, name: "Dog", isVisible: true },
        { id: 7, name: "Cat", isVisible: true },
      ],
      isVisible: true,
    },
  ]);

  // Manejar cambios en los campos de texto
  const handleFieldChange = (id, key, value) => {
    const updatedSections = navbarSections.map((section) =>
      section.id === id ? { ...section, [key]: value } : section
    );
    setNavbarSections(updatedSections);
  };

  // Manejar visibilidad de las secciones
  const handleToggleVisibility = (id) => {
    const updatedSections = navbarSections.map((section) =>
      section.id === id ? { ...section, isVisible: !section.isVisible } : section
    );
    setNavbarSections(updatedSections);
  };

  // Manejar cambios en categorías y subcategorías
  const handleCategoryChange = (id, key, value) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, [key]: value } : category
    );
    setCategories(updatedCategories);
  };

  const handleSubcategoryChange = (categoryId, subcategoryId, key, value) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            subcategories: category.subcategories.map((sub) =>
              sub.id === subcategoryId ? { ...sub, [key]: value } : sub
            ),
          }
        : category
    );
    setCategories(updatedCategories);
  };

  // Agregar una nueva sección
  const handleAddSection = () => {
    const newSection = {
      id: navbarSections.length + 1,
      name: "",
      link: "",
      isVisible: true,
    };
    setNavbarSections([...navbarSections, newSection]);
  };

  // Eliminar una sección
  const handleDeleteSection = (id) => {
    const updatedSections = navbarSections.filter((section) => section.id !== id);
    setNavbarSections(updatedSections);
  };

  return (
    <div className="edit-navbar-container">
      <h1>Edit Navbar</h1>

      {/* Secciones principales del navbar */}
      {navbarSections.map((section) => (
        <div key={section.id} className="navbar-section-edit">
          <input
            type="text"
            value={section.name}
            onChange={(e) => handleFieldChange(section.id, "name", e.target.value)}
            placeholder="Section Name"
            className="navbar-input"
          />
          <input
            type="text"
            value={section.link}
            onChange={(e) => handleFieldChange(section.id, "link", e.target.value)}
            placeholder="Section Link"
            className="navbar-input"
          />
          <input
            type="checkbox"
            checked={section.isVisible}
            onChange={() => handleToggleVisibility(section.id)}
            className="navbar-checkbox"
          />
          <button
            onClick={() => handleDeleteSection(section.id)}
            className="delete-btn"
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}

      {/* Categorías y subcategorías */}
      <h2>Categories</h2>
      {categories.map((category) => (
        <div key={category.id} className="category-edit">
          <div className="category-header">
            <input
              type="text"
              value={category.name}
              onChange={(e) =>
                handleCategoryChange(category.id, "name", e.target.value)
              }
              placeholder="Category Name"
              className="category-input"
            />
            <input
              type="checkbox"
              checked={category.isVisible}
              onChange={() => handleCategoryChange(category.id, "isVisible", !category.isVisible)}
              className="category-checkbox"
            />
          </div>
          <ul className="subcategory-list">
            {category.subcategories.map((sub) => (
              <li key={sub.id} className="subcategory-item">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubcategoryChange(category.id, sub.id, "name", e.target.value)
                  }
                  placeholder="Subcategory Name"
                  className="subcategory-input"
                />
                <input
                  type="checkbox"
                  checked={sub.isVisible}
                  onChange={() =>
                    handleSubcategoryChange(category.id, sub.id, "isVisible", !sub.isVisible)
                  }
                  className="subcategory-checkbox"
                />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button className="add-section-btn" onClick={handleAddSection}>
        + Add Section
      </button>
    </div>
  );
};

export default EditNavbar;

