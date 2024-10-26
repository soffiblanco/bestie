import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaymentPage.css'; // Asegúrate de tener tu archivo de estilos personalizado

function PaymentPage() {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de Pago', { cardNumber, expiryDate, cvv, name, address });
        navigate('/payment-success');
    };

    return (
        <div className="container mt-5">
            <div className="card p-4" style={{ backgroundColor: 'blueviolet', borderRadius: '10px' }}>
                <h2 className="text-center text-white mb-4">Detalles de Pago</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="text-white">Número de Tarjeta</label>
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
                                <label className="text-white">Fecha de Expiración</label>
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
                        <label className="text-white">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre completo"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label className="text-white">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Dirección completa"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success btn-block mt-4">
                        Finalizar Compra
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PaymentPage;

