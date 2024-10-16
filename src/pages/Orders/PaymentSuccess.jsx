// PaymentSuccess.jsx
import React from 'react';
import  './PaymentSuccess.css';

function PaymentSuccess() {
    return (
        <div className="container mt-5">
            <h2 className="text-center text-success">¡Tu compra se ha realizado con éxito!</h2>
            <p className="text-center">Gracias por tu compra. Te enviaremos un correo con los detalles de tu pedido.</p>
        </div>
    );
}

export default PaymentSuccess;
