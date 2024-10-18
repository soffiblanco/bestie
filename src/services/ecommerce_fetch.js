// src/services/ecommerce_fetch.js
const ecommerce_fetch = (url, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
  
    const headers = {
      ...defaultHeaders,
      ...(options.headers || {}),
    };
  
    const mergedOptions = {
      ...options,
      headers,
      redirect: 'follow',
    };
  
    return fetch(url, mergedOptions);
  };
  
  export default ecommerce_fetch;