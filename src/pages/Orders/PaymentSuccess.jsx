import React from 'react';
import './PaymentSuccess.css';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const redirectToOrders = () => {
        navigate('/orders'); 
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-success">¡Tu compra se ha realizado con éxito!</h2>
            <p className="text-center">Puedes ver el seguimiento de tu orden aquí.</p>
            <button onClick={redirectToOrders} className="btn btn-primary">Ver mis órdenes</button>
        </div>
    );
};

export default PaymentSuccess;

