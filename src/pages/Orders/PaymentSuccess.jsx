// PaymentSuccess.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderContext } from '../../pages/Orders/OrderContexts';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { setOrderItems } = useContext(OrderContext); // Asegúrate de exponer esta función en el contexto

    const redirectToOrders = () => {
        // Limpiar el carrito después de la compra
        setOrderItems([]);
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
