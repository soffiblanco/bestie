// PaymentPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaymentPage.css';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import { useAuth } from '../../Auth/AuthContext';

function PaymentPage() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();
    const { orderItems, createOrder } = useContext(OrderContext);
    const {userData}= useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id_user = userData.id_user;

        // Validate data before submitting (optional)
        if (orderItems.length === 0) {
            alert("No products in the order.");
            return;
        }

        // Prepare order data
        const orderData = {
            id_user:id_user, 
            NIT: '123456789', // Replace with the actual NIT
            Shipping_Price: 50.00, // Example
            Minimum_Amount_Surcharge: 10.00, // Example
            Total: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            Order_State: "Accepted",
            Order_Date: new Date().toISOString(),
            Direction_Order: address,
            details: orderItems.map(item => ({
                ID_Product: item.id, // Ensure each product has an ID
                Product_Amount: item.quantity,
                Unit_Price: item.price,
                Subtotal: item.price * item.quantity
            }))
        };

        try {
            const response = await createOrder(orderData);
            console.log('Order created:', response);
            // Clear the cart if necessary
            // setOrderItems([]);
            navigate('/payment-success');
        } catch (error) {
            console.error("Error creating order:", error);
            alert("There was a problem processing your order. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4" style={{ backgroundColor: 'blueviolet', borderRadius: '10px' }}>
                <h2 className="text-center text-white mb-4">Payment Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="text-white">Card Number</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="text-white">Expiry Date</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="text-white">CVV</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <label className="text-white">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label className="text-white">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Full address"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success btn-block mt-4">
                        Complete Purchase
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PaymentPage;
