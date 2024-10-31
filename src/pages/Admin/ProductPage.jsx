import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAuth} from '../../Auth/AuthContext.js';
import HasPermission from '../../Auth/HasPermission';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const navigate = useNavigate();
  const {userData} = useAuth();

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/products.php`, { method: 'GET' })
      .then(response => {
        if (!response.ok) throw new Error('Error fetching products');
        return response.json();
      })
      .then(data => {
        const groupedProducts = groupProductsByCategoriesAndSubcategories(data.data || []);
        setProducts(groupedProducts);

        const initiallyFeatured = groupedProducts
          .filter(product => product.Is_Featured === "1")
          .map(product => product.ID_Product);
        setFeaturedProducts(initiallyFeatured);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const groupProductsByCategoriesAndSubcategories = (data) => {
    const grouped = {};
    data.forEach(product => {
      const productId = product.ID_Product;
      if (!grouped[productId]) {
        grouped[productId] = { ...product, categories: new Set(), subcategories: new Set() };
      }
      if (product.Category) grouped[productId].categories.add(product.Category);
      if (product.Subcategory) grouped[productId].subcategories.add(product.Subcategory);
    });

    return Object.values(grouped).map(product => ({
      ...product,
      categories: Array.from(product.categories).join(', '),
      subcategories: Array.from(product.subcategories).join(', '),
    }));
  };

  const handleEdit = (productId) => {
    navigate(`/EditProduct/${productId}`);
  };

  const handleToggleState = (productId, currentState) => {
    ecommerce_fetch(`${baseUrl}/products.php`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ID_Product: productId }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Error updating product state');
        return response.json();
      })
      .then(data => {
        toast.success(data.message);
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.ID_Product === productId
              ? { ...product, Product_State: currentState === 'Enabled' ? 'Disabled' : 'Enabled' }
              : product
          )
        );
      })
      .catch(err => toast.error('Error: ' + err.message));
  };

  const handleAddUser = () => {
    navigate('/AddProduct');
  };

  const handleFeaturedChange = (productId) => {
    setFeaturedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 4) {
        return [...prev, productId];
      } else {
        toast.error("Only 4 products can be featured.");
        return prev;
      }
    });
  };

  const saveFeaturedProducts = () => {
    ecommerce_fetch(`${baseUrl}/updateFeaturedProducts.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featuredProducts }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Error updating featured products');
        return response.json();
      })
      .then(data => toast.success(data.message))
      .catch(err => toast.error('Error: ' + err.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-page-container">
      <ToastContainer />
      <h1 className="table-title">Product List</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Product Image</th>
            <th>ID</th>
            <th>Product</th>
            <th>Product Description</th>
            <th>Brand</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Categories</th>
            <th>Subcategories</th>
            <th>Product State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.ID_Product}>
              <td>
                <img
                  className="profile-image"
                  src={product.Product_Image}
                  alt={product.Product || 'Product Image'}
                  style={{ width: '50px', height: '50px' }}
                />
              </td>
              <td>{product.ID_Product || 'ID not available'}</td>
              <td>{product.Product || 'Product Name not available'}</td>
              <td>{product.Product_Description || 'Product Description not available'}</td>
              <td>{product.Brand || 'Brand not available'}</td>
              <td>{product.Stock || 'Stock not available'}</td>
              <td>{product.Price || 'Price not available'}</td>
              <td>{product.categories || 'Categories not available'}</td>
              <td>{product.subcategories || 'Subcategories not available'}</td>
              <td>{product.Product_State || 'Product State not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(product.ID_Product)}>Edit</button>
                <button
                  className="toggle-state-button"
                  onClick={() => handleToggleState(product.ID_Product, product.Product_State)}
                >
                  {product.Product_State === 'Enabled' ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Add</button>

      <HasPermission permission="Admin User ">
      <div className="featured-selector">
 
        <h2>Select Featured Products</h2>
        <p className="featured-instruction">
          Select up to 4 products to mark them as featured. These selected products will be displayed on the main page.
        </p>
        <div className="product-list">
          {products.map(product => (
            <button
              key={product.ID_Product}
              onClick={() => handleFeaturedChange(product.ID_Product)}
              className={`product-button ${featuredProducts.includes(product.ID_Product) ? 'selected' : ''}`}
            >
              {product.Product}
            </button>
          ))}

        </div>
        <button className="save-featured-button" onClick={saveFeaturedProducts}>Save Featured Products</button>
           
      </div>
      </HasPermission> 

    </div>
  );
};

export default ProductPage;
