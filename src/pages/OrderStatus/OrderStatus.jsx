import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderStatus = ({ status }) => {
    const orderStatusList = [
        'Pendiente', 'Preparando', 'En camino', 'Entregado', 'Cancelado'
    ];

    return (
        <div className="container my-4">
            <div className="card" style={{ backgroundColor: '#9333EA', color: 'white', borderRadius: '8px' }}>
                <div className="card-body">
                    <h3 className="card-title text-center">Estado de tu Orden</h3>
                    <ul className="list-group list-group-flush mt-3">
                        {orderStatusList.map((state, index) => (
                            <li 
                                key={index} 
                                className={`list-group-item ${status === state ? 'active' : ''}`}
                                style={{
                                    backgroundColor: status === state ? '#FFD700' : 'transparent',
                                    color: status === state ? '#333' : 'white',
                                    fontWeight: status === state ? 'bold' : 'normal'
                                }}
                            >
                                {state}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;



