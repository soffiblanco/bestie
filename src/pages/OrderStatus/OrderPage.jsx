import React, { useState, useEffect } from 'react';
import OrderStatus from './OrderStatus';
import OrderHistory from './OrderHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderPage.css'; 
import ecommerce_fetch from '../../services/ecommerce_fetch.js'; // Importar ecommerce_fetch

const OrdersPage = () => {
    const [currentOrderStatus, setCurrentOrderStatus] = useState('Pendiente');
    const [orderHistory, setOrderHistory] = useState([]);
    const [orders, setOrders] = useState([]); // Estado para las órdenes actuales
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        ecommerce_fetch('http://localhost/apis/orders.php')
            .then((response) => {
                console.log("Status Code for orders:", response.status); // Código de estado
                if (!response.ok) {
                    throw new Error('Error al obtener las órdenes');
                }
                return response.json();
            })
            .then((data) => {
                console.log("Orders Data:", data); // Mostrar los datos de las órdenes
                setOrders(data);
                setCurrentOrderStatus(data[0]?.Order_State || 'Pendiente');
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setError(err.message);
            });

        // Reemplazar fetch por ecommerce_fetch
        ecommerce_fetch('http://localhost/apis/order_history.php')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener el historial de órdenes');
                }
                return response.json();
            })
            .then((data) => {
                setOrderHistory(data);
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
        <div className="container orders-page">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="card order-status-container">
                        <div className="card-body">
                            <h3 className="card-title">Estado Actual de la Orden</h3>
                            <OrderStatus status={currentOrderStatus} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-5">
                <div className="col-lg-10 col-md-12">
                    <div className="card order-history-section">
                        <div className="card-body">
                            <h3 className="card-title">Historial de Órdenes</h3>
                            <OrderHistory orders={orderHistory} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
