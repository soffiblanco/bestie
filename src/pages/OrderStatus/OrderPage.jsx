import React, { useState, useEffect } from 'react';
import OrderStatus from './OrderStatus';
import OrderHistory from './OrderHistory';
import './OrderStatus.css';

const OrdersPage = () => {
    const [currentOrderStatus, setCurrentOrderStatus] = useState('Pendiente');
    const [orderHistory, setOrderHistory] = useState([]);
    const [orders, setOrders] = useState([]); // Estado para las órdenes actuales
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        // Llamada para obtener las órdenes
        fetch('http://localhost/api/orders')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener las órdenes');
                }
                return response.json();
            })
            .then((data) => {
                setOrders(data); // Guardar los datos de órdenes
                setCurrentOrderStatus(data[0]?.Order_State || 'Pendiente'); // Establecer el estado de la orden (puedes ajustar esto según lo necesites)
            })
            .catch((err) => {
                setError(err.message);
            });

        // Llamada para obtener el historial de órdenes
        fetch('http://localhost/api/order_history')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener el historial de órdenes');
                }
                return response.json();
            })
            .then((data) => {
                setOrderHistory(data); // Guardar los datos del historial de órdenes
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Cargando órdenes y historial...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="orders-page">
            <OrderStatus status={currentOrderStatus} /> {/* Mostramos el estado de la orden actual */}
            <OrderHistory orders={orderHistory} /> {/* Mostramos el historial de órdenes */}
        </div>
    );
};

export default OrdersPage;


