// PaymentSuccess.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../../pages/Orders/OrderContexts';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { setOrderItems } = useContext(OrderContext); // Make sure this function is exposed in the context

    const redirectToOrders = () => {
        // Clear the cart after purchase
        setOrderItems([]);
        navigate('/orders'); 
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success">Your purchase was successful!</h2>
            <p className="text-center">You can track your order here.</p>
            <button onClick={redirectToOrders} className="btn btn-primary">View My Orders</button>
        </div>
    );
};

export default PaymentSuccess;
