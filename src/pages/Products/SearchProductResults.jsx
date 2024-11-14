import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../config.js";
import "./SearchProductResults.css";
import Select from "react-dropdown-select";
import ecommerce_fetch from '../../services/ecommerce_fetch';

const SearchProductResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchValue = searchParams.get("value") || "";

  const handleProductClick = (productId) => {
    navigate(`/CatalogProducts/:category/:subcategory/product/${productId}`);
  };

  useEffect(() => {
    // Fetch categories
    ecommerce_fetch(`${baseUrl}/category.php`)
      .then(response => response.json())
      .then(data => setCategories(data.data || []))
      .catch(error => console.error("Error fetching categories:", error));

    // Fetch subcategories and remove duplicates
    ecommerce_fetch(`${baseUrl}/subcategory.php`)
      .then(response => response.json())
      .then(data => {
        const uniqueSubcategories = data.data.filter(
          (subcat, index, self) =>
            index === self.findIndex((t) => t.subcategory === subcat.subcategory)
        );
        setSubcategories(uniqueSubcategories);
      })
      .catch(error => console.error("Error fetching subcategories:", error));
  }, []);

  useEffect(() => {
    if (searchValue) {
      setLoading(true);
      setError("");
      setResults([]);

      const params = new URLSearchParams({
        searchValue,
        category: selectedCategories.length > 0 ? selectedCategories.join(",") : "",
        subcategory: selectedSubcategories.length > 0 ? selectedSubcategories.join(",") : "",
        minPrice: minPrice !== "" ? minPrice : null,
        maxPrice: maxPrice !== "" ? maxPrice : null,
      });

     ecommerce_fetch(`${baseUrl}/search.php?${params}`)
        .then(response => response.json())
        .then(data => {
          if (data.data && data.data.length > 0) {
            setResults(data.data);
          } else {
            setError("No products found.");
          }
        })
        .catch(() => {
          setError("Failed to fetch products.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchValue, selectedCategories, selectedSubcategories, minPrice, maxPrice]);

  const handleCategoryChange = (selectedCats) => {
    setSelectedCategories(selectedCats.map(cat => cat.category));
  };

  const handleSubcategoryChange = (selectedSubcats) => {
    setSelectedSubcategories(selectedSubcats.map(subcat => subcat.subcategory));
  };

  return (
    <div className="search-results">
      <div style={{ color: "black" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading...</p>}

        <div className="filters">
          <h3>Filter by Categories</h3>
          {categories.length > 0 && (
            <Select
              multi
              options={categories}
              labelField="category"
              valueField="id_category"
              placeholder="Select Categories"
              onChange={handleCategoryChange}
            />
          )}

          <h3>Filter by Subcategories</h3>
          {subcategories.length > 0 && (
            <Select
              multi
              options={subcategories}
              labelField="subcategory"
              valueField="id_subcategory"
              placeholder="Select Subcategories"
              onChange={handleSubcategoryChange}
            />
          )}

          <h3>Price Range:</h3>
          <div className="price-range">
            <label>
              Min Price:
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </label>
            <label>
              Max Price:
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </label>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid">
            {results.map((product, index) => (
              <div key={index} className="card">
                <img
                  src={product.Product_Image}
                  alt={product.Product}
                  className="card-image"
                />
                <div className="card-content">
                  <h2>{product.Product}</h2>
                  <p>{product.Product_Description}</p>
                  <p><strong>Price:</strong> ${product.Price}</p>
                  <button onClick={() => handleProductClick(product.ID_Product)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchProductResults;
