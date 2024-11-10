import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaDollarSign, FaBoxOpen, FaTruck, FaCheck } from 'react-icons/fa';
import './OrderStatus.css';
import { baseUrl } from '../../config';

const OrderStatus = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { fetchOrderById } = useContext(OrderContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);

    const orderStatusList = [
        { name: 'Accepted', icon: <FaDollarSign className="status-icon" />, message: "Your order is pending approval." },
        { name: 'In_Preparation', icon: <FaBoxOpen className="status-icon" />, message: "Your order is being prepared." },
        { name: 'On_Delivery_Route', icon: <FaTruck className="status-icon" />, message: "Your order is on the way." },
        { name: 'Delivered', icon: <FaCheck className="status-icon" />, message: "Your order has been delivered." },
    ];

    useEffect(() => {
        const loadOrder = async () => {
            try {
                // Obtener los datos básicos del pedido
                const orderData = await fetchOrderById(orderId);
                if (orderData) {
                    setOrder(orderData);
                } else {
                    setError("Order not found");
                }

                // Obtener los detalles de los productos en el pedido
                const response = await fetch(`${baseUrl}/getOrderSummary.php?ID_Order=${orderId}`);
                if (!response.ok) throw new Error("Error fetching order details");

                const data = await response.json();
                if (data && data.data) {
                    // Si `ID_Product`, `Category`, y `Subcategory` ya están presentes, úsalo directamente
                    const updatedDetails = data.data.map(item => {
                        console.log("Product details loaded:", item); // Log para verificar cada producto
                        return {
                            ...item,
                            Category: item.Category || 'Unknown',
                            Subcategory: item.Subcategory || 'Unknown',
                            ID_Product: item.ID_Product
                        };
                    });
                    setOrderDetails(updatedDetails);
                } else {
                    setError("Order details not found");
                }
                
            } catch (err) {
                setError("Error fetching order");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, fetchOrderById]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div>{error}</div>;

    if (!order || !orderDetails.length) {
        return <div>Order details not available.</div>;
    }

    const currentStatusIndex = orderStatusList.findIndex(status => status.name === order.Order_State);
    const currentStatusMessage = currentStatusIndex !== -1 ? orderStatusList[currentStatusIndex].message : "Order state not recognized.";

    // Manejador para redirigir a la página de detalles del producto
    const handleProductClick = (category, subcategory, productId) => {
        if (category && subcategory && productId) {
            console.log("Navigating to product:", { category, subcategory, productId }); // Log para verificar la navegación correcta
            navigate(`/CatalogProducts/${category}/${subcategory}/product/${productId}`);
        } else {
            console.warn("Product details are incomplete:", { category, subcategory, productId });
        }
    };

    return (
        <div className="container my-4">
            <h3 className="text-center mb-4">Order Tracking</h3>
            <div className="d-flex justify-content-around align-items-center position-relative">
                {orderStatusList.map((state, index) => (
                    <div key={index} className="text-center" style={{ position: 'relative', zIndex: 2 }}>
                        <div className={`status-icon-container ${index <= currentStatusIndex ? 'active' : ''}`}>
                            {index <= currentStatusIndex ? <FaCheckCircle className="status-icon" /> : state.icon}
                        </div>
                        <p style={{ marginTop: '8px', color: index <= currentStatusIndex ? '#333' : '#777', fontWeight: index === currentStatusIndex ? 'bold' : 'normal' }}>
                            {state.name}
                        </p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-4">
                <p className="status-message">{currentStatusMessage}</p>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                <div className="card p-4 mt-4 order-summary-card" style={{ flex: 1 }}>
                    <h3 className="text-center order-summary-title">Order Summary</h3>
                    <ul className="list-group mb-4 order-list">
                        <li className="list-group-item"><strong>Order ID:</strong> {order.ID_Order}</li>
                        <li className="list-group-item"><strong>Name:</strong> {order.Name}</li>
                        <li className="list-group-item"><strong>NIT:</strong> {order.NIT}</li>
                        <li className="list-group-item"><strong>Card Referencer:</strong> {order.Card_Referencer}</li>
                        <li className="list-group-item"><strong>Order Date:</strong> {new Date(order.Order_Date).toLocaleDateString()}</li>
                        <li className="list-group-item"><strong>Order Status:</strong> {order.Order_State}</li>
                        <li className="list-group-item"><strong>Shipping Address:</strong> {order.Direction_Order}</li>
                    </ul>
                </div>

                <div className="card p-4 mt-4 order-summary-card" style={{ flex: 1 }}>
                    <h3 className="text-center order-summary-title">Products in Order</h3>
                    <ul className="list-group mb-4 order-list">
                        {orderDetails.map((item, index) => (
                            <li
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center order-item"
                                onClick={() => handleProductClick(item.Category, item.Subcategory, item.ID_Product)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="d-flex align-items-center">
                                    <img
                                        src={item.Product_Image || 'https://via.placeholder.com/50'}
                                        alt={item.Product_Name || 'Product'}
                                        className="img-thumbnail order-item-image"
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    <div className="order-item-info">
                                        <h6>{item.Product_Name || 'Product Title'}</h6>
                                        <p>Category: {item.Category || 'Unknown'}</p>
                                        <p>Subcategory: {item.Subcategory || 'Unknown'}</p>
                                        <p>Q{item.Unit_Price || 0} x {item.Product_Amount || 0}</p>
                                    </div>
                                </div>
                                <div>
                                    <strong>Q{((item.Unit_Price || 0) * (item.Product_Amount || 0)).toFixed(2)}</strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="order-summary text-center">
                        <p><strong>Shipping Price:</strong> Q{order.Shipping_Price}</p>
                        <p><strong>Surcharge:</strong> Q{order.Minimum_Amount_Surcharge}</p>
                        <h4>Total: Q{Number(order.Total || 0).toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;
