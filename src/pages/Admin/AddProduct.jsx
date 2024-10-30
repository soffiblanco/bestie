import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js';
import './Add.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const AddProduct = () => {
  const [product, setProduct] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Multiple categories
  const [selectedSubcategories, setSelectedSubcategories] = useState([]); // Multiple subcategories
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/category.php`, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((error) => {
        toast.error('Error fetching categories: ' + error.message);
      });
  }, []);

  // Fetch subcategories based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      ecommerce_fetch(`${baseUrl}/subcategoryBycategory.php?id_category=${selectedCategories.join(',')}`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
          setSubcategories(data.data || []);
        })
        .catch((error) => {
          toast.error('Error fetching subcategories: ' + error.message);
        });
    } else {
      setSubcategories([]);
    }
  }, [selectedCategories]);


  // Manejar el cambio de la imagen y actualizar el estado
// Función para manejar la conversión de imagen a Base64
const handleImageChange = (e, setImageBase64) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      const mimeType = file.type;
      const fullBase64String = `data:${mimeType};base64,${base64String}`;
      setImageBase64(fullBase64String);
    };
    reader.readAsDataURL(file);
  }
};


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Datos que la API requiere en el formato adecuado
    const data = {
      product,
      product_description: productDescription,
      brand,
      stock: parseInt(stock), // Convierte stock a número entero
      price: parseFloat(price), // Convierte price a número decimal
      product_state: enabled ? 'Enabled' : 'Disabled', 
      id_category: selectedCategories, // Enviar como arreglo
      id_subcategory: selectedSubcategories // Enviar como arreglo
    };

    if (imageBase64) {
      data.product_image = imageBase64;
    }


    console.log('Datos a enviar al servidor:', JSON.stringify(data, null, 2));

    ecommerce_fetch(`${baseUrl}/products.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message || 'Product added successfully');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      })
      .catch((error) => {
        toast.error('Error: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle multiple selection for categories and subcategories
  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCategories(selected);
  };

  const handleSubcategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSubcategories(selected);
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="add-category-container">
        <h1>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="product">Product Name:</label>
            <input
              type="text"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="product_description">Product Description:</label>
            <textarea
              id="product_description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows="4"
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          <div className="input-container">
            <label htmlFor="product_image">Product Image:</label>
            <input
              type="file"
              id="product_image"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setImageBase64)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="brand">Brand:</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="stock">Stock:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock quantity"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              step="0.01"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={selectedCategories}
              onChange={handleCategoryChange}
              multiple
              required
            >
              {categories.map((cat) => (
                <option key={cat.id_category} value={cat.id_category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="subcategory">Subcategory:</label>
            <select
              id="subcategory"
              value={selectedSubcategories}
              onChange={handleSubcategoryChange}
              multiple
              required
              disabled={selectedCategories.length === 0}
            >
              {subcategories.map((subcat) => (
                <option key={subcat.id_subcategory} value={subcat.id_subcategory}>
                  {subcat.subcategory}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="enabled">Enabled:</label>
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
