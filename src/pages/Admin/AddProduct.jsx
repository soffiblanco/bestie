import React, { useState, useEffect } from 'react';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch.js';

const AddProduct = () => {
  const [product, setProduct] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('product', product);
    formData.append('product_description', productDescription);
    formData.append('product_image', productImage);
    formData.append('brand', brand);
    formData.append('stock', stock);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('enabled', enabled ? 1 : 0);

    ecommerce_fetch(`${baseUrl}/product.php`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((error) => {
        setMessage('Error: ' + error.message);
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Add New Product</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="product">Product Name:</label><br />
            <input
              type="text"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="product_description">Product Description:</label><br />
            <textarea
              id="product_description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows="4"
              required
            ></textarea>
          </div>
          <br />
          <div>
            <label htmlFor="product_image">Product Image:</label><br />
            <input
              type="file"
              id="product_image"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="brand">Brand:</label><br />
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="stock">Stock:</label><br />
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="price">Price:</label><br />
            <input
              type="number"
              step="0.01"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="category">Category:</label><br />
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="subcategory">Subcategory:</label><br />
            <input
              type="text"
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="enabled">Enabled:</label><br />
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </div>
          <br />
          <button type="submit" disabled={loading}>Add Product</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;