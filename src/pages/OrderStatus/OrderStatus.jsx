import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaDollarSign, FaBoxOpen, FaTruck, FaCheck } from 'react-icons/fa';
import './OrderStatus.css'; // Importar archivo CSS

const OrderStatus = ({ status }) => {
    const orderStatusList = [
        { name: 'Pendiente', icon: <FaDollarSign className="status-icon" /> },
        { name: 'Preparando', icon: <FaBoxOpen className="status-icon" /> },
        { name: 'En camino', icon: <FaTruck className="status-icon" /> },
        { name: 'Entregado', icon: <FaCheck className="status-icon" /> },
    ];

    return (
        <div className="container my-4">
            <h3 className="text-center mb-4">Seguimiento de Despacho</h3>
            <div className="d-flex justify-content-around align-items-center position-relative">
                {/* Línea de progreso */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '10%',
                        right: '10%',
                        height: '4px',
                        backgroundColor: '#28a745',
                        zIndex: 1,
                    }}
                />

                {orderStatusList.map((state, index) => (
                    <div
                        key={index}
                        className="text-center"
                        style={{ position: 'relative', zIndex: 2 }}
                    >
                        <div
                            className={`status-icon-container ${
                                status === state.name || orderStatusList.findIndex(s => s.name === status) > index
                                    ? 'active'
                                    : ''
                            }`}
                        >
                            {status === state.name || orderStatusList.findIndex(s => s.name === status) > index ? (
                                <FaCheckCircle className="status-icon" />
                            ) : (
                                state.icon
                            )}
                        </div>
                        <p
                            style={{
                                marginTop: '8px',
                                color: status === state.name || orderStatusList.findIndex(s => s.name === status) > index ? '#333' : '#777',
                                fontWeight: status === state.name ? 'bold' : 'normal',
                            }}
                        >
                            {state.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatus;




