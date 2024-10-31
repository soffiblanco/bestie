// OrderContexts.js
import React, { createContext, useState } from 'react';
import ecommerce_fetch from '../../services/ecommerce_fetch';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await ecommerce_fetch('http://localhost/apis/orders.php');
            if (!response.ok) throw new Error('Error fetching orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const response = await ecommerce_fetch(`http://localhost/apis/orders.php?id=${orderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error deleting order');
            setOrders((prevOrders) => prevOrders.filter(order => order.ID_Order !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    };

    return (
        <OrderContext.Provider value={{ orders, fetchOrders, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
