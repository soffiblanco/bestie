// PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css'

function PaymentPage() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí deberías manejar la lógica de pago
        console.log('Datos de Pago', { cardNumber, expiryDate, cvv, name, address });

        // Después de procesar el pago, redirigir al mensaje de éxito
        navigate('/payment-success');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Detalles de Pago</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Número de Tarjeta</label>
                    <input
                        type="text"
                        className="form-control"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Fecha de Expiración</label>
                    <input
                        type="text"
                        className="form-control"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>CVV</label>
                    <input
                        type="text"
                        className="form-control"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">
                    Finalizar Compra
                </button>
            </form>
        </div>
    );
}

export default PaymentPage;
