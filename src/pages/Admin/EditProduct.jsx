import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config.js'
import ecommerce_fetch from '../../services/ecommerce_fetch';
import './EditProduct.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');
    const [enabled, setEnabled] = useState(true);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [productImage, setProductImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Control for checkboxes to update fields
    const [updateFields, setUpdateFields] = useState({
        product: false,
        productDescription: false,
        brand: false,
        stock: false,
        price: false,
        enabled: false,
        productImage: false,
        categories: false,
        subcategories: false,
    });

    useEffect(() => {
        setLoading(true);
        // Fetch existing product details
        ecommerce_fetch(`${baseUrl}/products.php?ID_Product=${productId}`,{
            method:'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data && data.data.length > 0) {
                    const productData = data.data[0];
                    setProduct(productData.Product);
                    setProductDescription(productData.Product_Description);
                    setBrand(productData.Brand);
                    setStock(productData.Stock);
                    setPrice(productData.Price);
                    setEnabled(productData.Enabled === 1);
                    setSelectedCategories([productData.Category]);
                    setSelectedSubcategories([productData.Subcategory]);
                }
            })
            .catch((error) => toast.error('Error fetching product:', error))
            .finally(() => setLoading(false));

        // Fetch categories
        ecommerce_fetch(`${baseUrl}/category.php`,{
            method:'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data) {
                    setCategories(data.data);
                }
            })
            .catch((error) => toast.error('Error fetching categories:', error));

        // Fetch subcategories
        ecommerce_fetch(`${baseUrl}/subcategory.php`,{
            method:'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data) {
                    setSubcategories(data.data);
                }
            })
            .catch((error) => toast.error('Error fetching subcategories:', error));
    }, [productId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const updateData = {
            id_product: productId,
        };

        if (updateFields.product) {
            updateData.product = product;
        }
        if (updateFields.productDescription) {
            updateData.product_description = productDescription;
        }
        if (updateFields.brand) {
            updateData.brand = brand;
        }
        if (updateFields.stock) {
            updateData.stock = stock;
        }
        if (updateFields.price) {
            updateData.price = price;
        }
        if (updateFields.enabled) {
            updateData.enabled = enabled ? 1 : 0;
        }
        if (updateFields.productImage && productImage) {
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
            body: JSON.stringify(updateData),
        })
            .then((response) => response.json())
            .then((data) => {
                toast.success(data.message || "Product updated successfully");
                setTimeout(() => {
                navigate('/products');
                }, 2000);
            })
            .catch((error) => {
              toast.error('Error updating product:', error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
    <ToastContainer position="top-right" />
        <div>
            <h6>Edit Product</h6>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="checkbox"
                            id="updateProduct"
                            checked={updateFields.product}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, product: e.target.checked })
                            }
                        />
                        <label htmlFor="product">Product:</label><br />
                        <input
                            type="text"
                            id="product"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            disabled={!updateFields.product}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateProductDescription"
                            checked={updateFields.productDescription}
                            onChange={(e) =>
                                setUpdateFields({
                                    ...updateFields,
                                    productDescription: e.target.checked,
                                })
                            }
                        />
                        <label htmlFor="productDescription">Product Description:</label><br />
                        <textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows="4"
                            disabled={!updateFields.productDescription}
                        ></textarea>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateBrand"
                            checked={updateFields.brand}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, brand: e.target.checked })
                            }
                        />
                        <label htmlFor="brand">Brand:</label><br />
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            disabled={!updateFields.brand}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateStock"
                            checked={updateFields.stock}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, stock: e.target.checked })
                            }
                        />
                        <label htmlFor="stock">Stock:</label><br />
                        <input
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            disabled={!updateFields.stock}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updatePrice"
                            checked={updateFields.price}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, price: e.target.checked })
                            }
                        />
                        <label htmlFor="price">Price:</label><br />
                        <input
                            type="number"
                            step="0.01"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            disabled={!updateFields.price}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateEnabled"
                            checked={updateFields.enabled}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, enabled: e.target.checked })
                            }
                        />
                        <label htmlFor="enabled">Enabled:</label><br />
                        <input
                            type="checkbox"
                            id="enabled"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            disabled={!updateFields.enabled}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateCategories"
                            checked={updateFields.categories}
                            onChange={(e) =>
                                setUpdateFields({ ...updateFields, categories: e.target.checked })
                            }
                        />
                        <label htmlFor="categories">Categories:</label><br />
                        <select
                            id="categories"
                            multiple
                            value={selectedCategories}
                            onChange={(e) =>
                                setSelectedCategories(
                                    Array.from(e.target.selectedOptions, (option) => option.value)
                                )
                            }
                            disabled={!updateFields.categories}
                        >
                            {categories.map((category) => (
                                <option key={category.id_category} value={category.category}>
                                    {category.category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateSubcategories"
                            checked={updateFields.subcategories}
                            onChange={(e) =>
                                setUpdateFields({
                                    ...updateFields,
                                    subcategories: e.target.checked,
                                })
                            }
                        />
                        <label htmlFor="subcategories">Subcategories:</label><br />
                        <select
                            id="subcategories"
                            multiple
                            value={selectedSubcategories}
                            onChange={(e) =>
                                setSelectedSubcategories(
                                    Array.from(e.target.selectedOptions, (option) => option.value)
                                )
                            }
                            disabled={!updateFields.subcategories}
                        >
                            {subcategories.map((subcategory) => (
                                <option key={subcategory.id_subcategory} value={subcategory.subcategory}>
                                    {subcategory.subcategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            id="updateProductImage"
                            checked={updateFields.productImage}
                            onChange={(e) =>
                                setUpdateFields({
                                    ...updateFields,
                                    productImage: e.target.checked,
                                })
                            }
                        />
                        <label htmlFor="productImage">Product Image:</label><br />
                        <input
                            type="file"
                            id="productImage"
                            accept="image/*"
                            onChange={(e) => setProductImage(e.target.files[0])}
                            disabled={!updateFields.productImage}
                        />
                    </div>
                    <br />
                    <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                </form>
            )}
        </div>
        </>
    );
};

export default EditProduct;