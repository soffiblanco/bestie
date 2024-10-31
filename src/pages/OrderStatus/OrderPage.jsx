// OrdersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import OrderStatus from './OrderStatus';
import OrderHistory from './OrderHistory';
import { OrderContext } from '../Orders/OrderContexts.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderPage.css';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';

const OrderPage = () => {
    const { orders, fetchOrders, deleteOrder } = useContext(OrderContext);
    const [currentOrderStatus, setCurrentOrderStatus] = useState('Pending');
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchOrders()
            .then(() => setCurrentOrderStatus(orders[0]?.Order_State || 'Pending'))
            .catch(err => setError('Error fetching orders'));

        ecommerce_fetch('http://localhost/apis/order_history.php')
            .then((response) => {
                if (!response.ok) throw new Error('Error fetching order history');
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
    }, [fetchOrders, orders]);

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrder(orderId);
                alert("Order deleted successfully.");
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("There was a problem deleting the order.");
            }
        }
    };

    if (loading) return <div>Loading orders and history...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container orders-page mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="card order-status-container mb-4">
                        <div className="card-body">
                            <h3 className="card-title">Current Order Status</h3>
                            <OrderStatus status={currentOrderStatus} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12">
                    <div className="card order-history-section mb-4">
                        <div className="card-body">
                            <h3 className="card-title">Order History</h3>
                            <OrderHistory orders={orderHistory} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h3 className="card-title">My Orders</h3>
                            {orders.length === 0 ? (
                                <p className="text-center">You have no orders.</p>
                            ) : (
                                <ul className="list-group">
                                    {orders.map(order => (
                                        <li key={order.ID_Order} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5>Order #{order.ID_Order}</h5>
                                                <p>Total: ${isNaN(order.Total) ? "0.00" : parseFloat(order.Total).toFixed(2)}</p>
                                                <p>Status: {order.Order_State}</p>
                                                <p>Date: {new Date(order.Order_Date).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(order.ID_Order)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
