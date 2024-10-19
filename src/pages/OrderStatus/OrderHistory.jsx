import React from 'react';
import './OrderStatus.css';

const OrderHistory = ({ orders }) => {
    return (
        <div className="order-history">
            <h3>Historial de Órdenes</h3>
            <ul>
                {orders.map((order) => (
                    <li key={order.ID_History_Order}> {/* Usamos ID_History_Order como clave */}
                        <p>Orden #{order.ID_Order}</p> {/* ID de la orden */}
                        <p>Estado: {order.State}</p> {/* Estado de la orden */}
                        <p>Fecha de cambio: {new Date(order.Change_Date).toLocaleDateString()}</p> {/* Fecha de cambio */}
                        <p>Comentario: {order.Change_Comment}</p> {/* Comentario del cambio */}
                        <p>Editabilidad: {order.Is_Editable ? 'Editable' : 'No editable'}</p> {/* Si es editable */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;


