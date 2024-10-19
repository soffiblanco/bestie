import React from 'react';
import './OrderStatus.css';

const OrderStatus = ({ status }) => {
    const orderStatusList = [
        'Pendiente', 'Preparando', 'En camino', 'Entregado', 'Cancelado'
    ];

    return (
        <div className="order-status">
            <h3>Estado de tu Orden</h3>
            <ul>
                {orderStatusList.map((state, index) => (
                    <li key={index} className={status === state ? 'active' : ''}>
                        {state}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderStatus;


