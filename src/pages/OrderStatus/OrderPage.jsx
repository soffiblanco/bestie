// OrdersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { OrderContext } from '../Orders/OrderContexts.jsx';
import { useAuth } from '../../Auth/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderPage.css';

const OrderPage = () => {
    const { orders, fetchOrders } = useContext(OrderContext);
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders()
            .then(() => {
                setLoading(false);
            })
            .catch(err => {
                setError('Error fetching orders');
                setLoading(false);
            });
    }, [fetchOrders]);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    const userOrders = orders.filter(order => order.ID_User == userData.id_user);

    const handleViewDetails = (orderId) => {
        navigate(`/orderStatus/${orderId}`);
    };

    return (
        <div className="container orders-page mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-md-12">
                    <div className="card_order mb-4">
                        <div className="card-body">
                            <h3 className="card-title">My Orders</h3>
                            {userOrders && userOrders.length === 0 ? (
                                <p className="text-center">You have no orders.</p>
                            ) : (
                                <ul className="list-group">
                                    {userOrders.map(order => (
                                        <li key={order.ID_Order} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5>Order #{order.ID_Order}</h5>
                                                <p>Total: Q{isNaN(order.Total) ? "0.00" : parseFloat(order.Total).toFixed(2)}</p>
                                                <p>Status: {order.Order_State}</p>
                                                <p>Date: {new Date(order.Order_Date).toLocaleDateString()}</p>
                                            </div>
                                            <button
                                                className="btn btn-primary-order btn-sm"
                                                onClick={() => handleViewDetails(order.ID_Order)}
                                            >
                                                View Details & Tracking
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
