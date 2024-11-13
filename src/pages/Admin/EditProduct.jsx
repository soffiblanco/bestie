import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';
import './EditProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
    const { productId } = useParams();
    const [initialData, setInitialData] = useState({});
    const [product, setProduct] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [categories, setCategories] = useState([]);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        // Fetch existing product details
        ecommerce_fetch(`${baseUrl}/products.php?ID_Product=${productId}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data && data.data.length > 0) {
                    const productData = data.data[0];
                    setInitialData(productData);
                    setProduct(productData.Product);
                    setProductDescription(productData.Product_Description);
                    setBrand(productData.Brand);
                    setStock(productData.Stock);
                    setPrice(productData.Price);
                    setEnabled(productData.Enabled === 1);
                    setSelectedCategory(productData.Category); // Set category name
                    setSelectedSubcategories([productData.Subcategory]);
                    setImageUrl(productData.Product_Image);
                }
            })
            .catch(() => toast.error('Error fetching product'))
            .finally(() => setLoading(false));

        // Fetch categories
        ecommerce_fetch(`${baseUrl}/category.php`, { method: 'GET' })
            .then((response) => response.json())
            .then((data) => setCategories(data.data || []))
            .catch(() => toast.error('Error fetching categories'));

    }, [productId]);

    // Fetch subcategories based on the selected category name
    useEffect(() => {
        if (selectedCategory) {
            const selectedCategoryId = categories.find(category => category.category === selectedCategory)?.id_category;
            if (selectedCategoryId) {
                ecommerce_fetch(`${baseUrl}/subcategoryBycategory.php?id_category=${selectedCategoryId}`, { method: 'GET' })
                    .then((response) => response.json())
                    .then((data) => setAvailableSubcategories(data.data || []))
                    .catch(() => toast.error('Error fetching subcategories'));
            }
        }
    }, [selectedCategory, categories]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!product.trim() || !productDescription.trim() || !brand.trim() || !stock.trim() || !price.trim() || !selectedCategory || selectedSubcategories.length === 0) {
            toast.error("Fields cannot be left empty");
            return;
        }

        setLoading(true);

        const updateData = {
            id_product: productId,
            product,
            product_description: productDescription,
            brand,
            stock,
            price,
            enabled: enabled ? 1 : 0,
            category: selectedCategory,
            subcategories: selectedSubcategories,
        };

        if (productImage) {
            const reader = new FileReader();
            reader.onload = () => {
                updateData.product_image = reader.result;
                sendUpdateRequest(updateData);
            };
            reader.readAsDataURL(productImage);
        } else {
            sendUpdateRequest(updateData);
        }
    };

    const sendUpdateRequest = (updateData) => {
        ecommerce_fetch(`${baseUrl}/products.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        })
            .then((response) => response.json())
            .then((data) => {
                toast.success(data.message || "Product updated successfully");
                setTimeout(() => navigate('/products'), 2000);
            })
            .catch(() => toast.error('Error updating product'))
            .finally(() => setLoading(false));
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleSubcategoryChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedSubcategories(selected);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="edit-product-container">
                <h6>Edit Product</h6>
                <form onSubmit={handleSubmit} className="edit-product-form">
                    <div>
                        <label htmlFor="product">Product:</label><br />
                        <input
                            type="text"
                            id="product"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="productDescription">Product Description:</label><br />
                        <textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows="4"
                            required
                        ></textarea>
                    </div>
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
                    <div>
                        <label htmlFor="enabled">Enabled:</label><br />
                        <input
                            type="checkbox"
                            id="enabled"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor="categories">Categories:</label><br />
                        <select
                            id="categories"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            required
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.category}>
                                    {category.category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subcategories">Subcategories:</label><br />
                        <select
                            id="subcategories"
                            multiple
                            value={selectedSubcategories}
                            onChange={handleSubcategoryChange}
                            required
                            disabled={selectedCategory === ''}
                        >
                            {availableSubcategories.map((subcategory) => (
                                <option key={subcategory.id_subcategory} value={subcategory.id_subcategory}>
                                    {subcategory.subcategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="productImage">Product Image:</label><br />
                        {imageUrl && (
                            <div className="image-preview">
                                <img src={imageUrl} alt="Current Product" className="img-edit" />
                            </div>
                        )}
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            onChange={(e) => setProductImage(e.target.files[0])}
                        />
                    </div>
                    <br />
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditProduct;
