import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../../config.js";
import "./SearchProductResults.css";

const SearchProductResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchValue = searchParams.get("value") || "";

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    if (searchValue) {
      setLoading(true);
      setError("");
      setResults([]);

      fetch(`${baseUrl}/search.php?value=${searchValue}`)
        .then((response) => response.json())
        .then((data) => {
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
  }, [searchValue]);

  return (
    <div style={{ color: "black" }}>
      <h1>Search Results</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && <p>Loading...</p>}

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
                <p>
                  <strong>Price:</strong> ${product.Price}
                </p>
                <p>

                  <button onClick={()=>handleProductClick(product.ID_Product)}>View Details </button>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchProductResults;
