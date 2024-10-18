import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ecommerce_fetch(`${baseUrl}/products.php`,{
     method:'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching products');
        }
        return response.json();
      })
      .then(data => {
        const groupedProducts = groupProductsByCategoriesAndSubcategories(data.data || []);
        setProducts(groupedProducts);
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
        grouped[productId] = {
          ...product,
          categories: new Set(),
          subcategories: new Set(),
        };
      }
      if (product.Category) {
        grouped[productId].categories.add(product.Category);
      }
      if (product.Subcategory) {
        grouped[productId].subcategories.add(product.Subcategory);
      }
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
  
  const handleDelete = (productId) => {
    console.log(`Delete product with ID: ${productId}`);
    ecommerce_fetch(`${baseUrl}/products.php?id_product=${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting product');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        setProducts(prevProducts => prevProducts.filter(product => product.ID_Product !== productId));
      })
      .catch(err => alert('Error: ' + err.message));
  };

  const handleAddUser = () => {
    navigate('/AddProduct');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="user-page-container">
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
            <th>Enabled</th>
            <th>Categories</th>
            <th>Subcategories</th>
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
              <td>{product.Enabled ? 'Yes' : 'No'}</td>
              <td>{product.categories || 'Categories not available'}</td>
              <td>{product.subcategories || 'Subcategories not available'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(product.ID_Product)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(product.ID_Product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={handleAddUser}>Add</button>
    </div>
  );
};

export default ProductPage;
