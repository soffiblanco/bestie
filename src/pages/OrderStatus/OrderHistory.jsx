import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderHistory = ({ orders }) => {
    return (
        <div className="container my-4">
            <h3 className="text-center mb-4" style={{ color: 'blueviolet' }}>Historial de Órdenes</h3>
            <div className="list-group">
                {orders.map((order) => (
                    <div 
                        key={order.ID_History_Order} 
                        className="list-group-item mb-3 p-3" 
                        style={{ backgroundColor: 'blueviolet', color: 'white', borderRadius: '10px' }}
                    >
                        <h5>Orden #{order.ID_Order}</h5>
                        <p><strong>Estado:</strong> {order.State}</p>
                        <p><strong>Fecha de cambio:</strong> {new Date(order.Change_Date).toLocaleDateString()}</p>
                        <p><strong>Comentario:</strong> {order.Change_Comment}</p>
                        <p><strong>Editabilidad:</strong> {order.Is_Editable ? 'Editable' : 'No editable'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;



