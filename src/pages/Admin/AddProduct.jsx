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
  const [productImage, setProductImage] = useState(''); // Base64 image
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
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

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (category) {
      ecommerce_fetch(`${baseUrl}/subcategoryBycategory.php?id_category=${category}`, { method: 'GET' })
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
  }, [category]);

  // Handle image change and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        const mimeType = file.type;
        const fullBase64String = `data:${mimeType};base64,${base64String}`;
        setProductImage(fullBase64String);
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
      product_image: productImage,
      brand,
      stock: parseInt(stock), // Convierte stock a número entero
      price: parseFloat(price), // Convierte price a número decimal
      product_state: enabled ? 'Enabled' : 'Disabled', // Asegúrate de enviar el estado como texto
      id_category: [category], // Enviar como un arreglo si la API lo requiere
      id_subcategory: [subcategory] // Enviar como un arreglo si la API lo requiere
    };

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
              onChange={handleImageChange}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
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
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
              disabled={!category}
            >
              <option value="">Select a subcategory</option>
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
