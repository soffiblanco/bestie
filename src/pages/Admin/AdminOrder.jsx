import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminOrder.css';
import { baseUrl } from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import ecommerce_fetch from '../../services/ecommerce_fetch';

const AdminOrder = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minPurchase, setMinPurchase] = useState('');
    const [surcharge, setSurcharge] = useState('');
    const [shippingPrice, setShippingPrice] = useState('');
    const [searchId, setSearchId] = useState(''); // Estado para el valor de búsqueda
    const { orders, fetchOrders } = useContext(OrderContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConfig();
        fetchUsers();
        fetchOrders()
            .then(() => setLoading(false))
            .catch(err => {
                setError('Error fetching orders');
                setLoading(false);
            });
    }, []);

    const fetchConfig = () => {
         ecommerce_fetch(`${baseUrl}}/config.php`)
            .then(response => response.json())
            .then(config => {
                setMinPurchase(config.min_purchase_amount);
                setSurcharge(config.surcharge_amount);
                setShippingPrice(config.shipping_price); 
            })
            .catch(error => {
                console.error("Error fetching configuration:", error);
            });
    };

    const fetchUsers = () => {
         ecommerce_fetch(`${baseUrl}/users.php`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setUsers([]);
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error al obtener los usuarios.');
            });
    };

    const getUserName = (userId) => {
        const user = users.find(user => user.ID_User == userId);
        return user ? user.Name : 'Unknown User';
    };

    const handleViewDetails = (orderId) => {
        navigate(`/ManagingOrder/${orderId}`);
    };

    const handleSaveConfig = () => {
         ecommerce_fetch(`${baseUrl}/config.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                min_purchase_amount: parseFloat(minPurchase),
                surcharge_amount: parseFloat(surcharge),
                shipping_price: parseFloat(shippingPrice)
            }),
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                toast.success(result.message);
                if (result.error) {
                    console.error("Error updating configuration:", result.error);
                }
            })
            .catch(error => {
                console.error("Error saving configuration:", error);
            });
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;

    // Filtrar las órdenes para que coincidan solo si el ID comienza con el valor de búsqueda
    const filteredOrders = searchId
        ? orders.filter(order => order.ID_Order.toString().startsWith(searchId))
        : orders;

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="admin-order-container">
                <h1>Admin Orders</h1>
                
                <div className="order-config">
                    <h2>Order Configuration</h2>
                    <div className="config-field">
                        <label htmlFor="minPurchase">Minimum Purchase Amount (Q):</label>
                        <input
                            type="number"
                            id="minPurchase"
                            value={minPurchase}
                            onChange={(e) => setMinPurchase(e.target.value)}
                            placeholder="Enter minimum purchase amount"
                        />
                    </div>
                    <div className="config-field">
                        <label htmlFor="surcharge">Surcharge Amount (Q):</label>
                        <input
                            type="number"
                            id="surcharge"
                            value={surcharge}
                            onChange={(e) => setSurcharge(e.target.value)}
                            placeholder="Enter surcharge amount"
                        />
                    </div>
                    <div className="config-field"> 
                        <label htmlFor="shippingPrice">Shipping Price (Q):</label>
                        <input
                            type="number"
                            id="shippingPrice"
                            value={shippingPrice}
                            onChange={(e) => setShippingPrice(e.target.value)}
                            placeholder="Enter shipping price"
                        />
                    </div>
                    <button className="save-config-button" onClick={handleSaveConfig}>Save Configuration</button>
                </div>

                <h1 className="mt-5">Order List</h1>

                {/* Campo de búsqueda */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Order ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>

                <div className="order-list">
                    {filteredOrders && filteredOrders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <ul className="list-group">
                            {filteredOrders.map(order => (
                                <li key={order.ID_Order} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>Order #{order.ID_Order}</h5>
                                        <p>User: {getUserName(order.ID_User)}</p>
                                        <p>Total: Q{isNaN(order.Total) ? "0.00" : parseFloat(order.Total).toFixed(2)}</p>
                                        <p>Status: {order.Order_State}</p>
                                        <p>Date: {new Date(order.Order_Date).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        className="btn btn-primary-order btn-sm"
                                        onClick={() => handleViewDetails(order.ID_Order)}
                                    >
                                        Managing Order
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminOrder;
