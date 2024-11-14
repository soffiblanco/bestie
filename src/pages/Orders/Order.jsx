// Order.jsx
import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Order.css';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config';
import ecommerce_fetch from '../../services/ecommerce_fetch';

function Order() {
    const { orderItems, addProductToOrder, removeProductFromOrder, decreaseProductQuantity } = useContext(OrderContext);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [minPurchaseAmount, setMinPurchaseAmount] = useState(0);

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch configuration data for shippingPrice and minPurchaseAmount
         ecommerce_fetch(`${baseUrl}/config.php`)
            .then(response => response.json())
            .then(data => {
                setShippingPrice(parseFloat(data.shipping_price || 0));  
                setMinPurchaseAmount(parseFloat(data.min_purchase_amount || 0));  
            })
            .catch(error => {
                console.error("Error fetching configuration:", error);
            });
    }, []);

    // Calculate total based on subtotal and minPurchaseAmount
    const total = subtotal >= minPurchaseAmount ? subtotal : subtotal + shippingPrice;

    const handleProceedToPayment = () => {
        navigate('/payment'); 
    };

    // Calculate amount needed to reach the minimum purchase amount
    const amountNeeded = minPurchaseAmount > subtotal ? minPurchaseAmount - subtotal : 0;

    return (
        <div className="container-fluid mt-5 order-container">
            <h2 className="text-center order-title">Shopping Cart</h2>
            {orderItems.length === 0 ? (
                <p className="text-center empty-order">No products in the order.</p>
            ) : (
                <ul className="list-group mb-4 order-list">
                    {orderItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center order-item">
                            <div className="d-flex align-items-center">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="img-thumbnail order-item-image"
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div className="order-item-info">
                                    <h6 className="order-item-title">{item.title}</h6>
                                    <p className="mb-0 order-item-price">Q{item.price} x {item.quantity}</p>
                                </div>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => decreaseProductQuantity(item)}
                                >
                                    -
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => addProductToOrder(item)}
                                >
                                    +
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeProductFromOrder(item)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Display calculated totals */}
            <div className="order-summary text-center">
                <h4 className="order-subtotal">Subtotal: Q{subtotal.toFixed(2)}</h4>
                <p className="order-shipping">Shipping Price: Q{shippingPrice.toFixed(2)}</p>
                <p className="order-minimum">Minimum Purchase Amount: Q{minPurchaseAmount.toFixed(2)}</p>
                
                {amountNeeded > 0 ? (
                    <>
                        <p className="order-notice">
                            You need Q{amountNeeded.toFixed(2)} more to reach the minimum purchase amount. A surcharge will be added.
                        </p>
                        <p className="order-surcharge">Additional Surcharge: Q{shippingPrice.toFixed(2)}</p>
                    </>
                ) : (
                    <p className="order-notice">You have reached the minimum purchase amount. No surcharge will be applied.</p>
                )}
                
                <h3 className="order-total">Total: Q{total.toFixed(2)}</h3>
            </div>

            {orderItems.length > 0 && (
                <button className="btn btn-success btn-block mt-4 add-product-button" onClick={handleProceedToPayment}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
     
}

export default Order;
