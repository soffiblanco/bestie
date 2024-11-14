// OrderContext.js
import React, { createContext, useState, useCallback } from 'react';
import axiosInstance from '../../services/axiosConfig';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [orders, setOrders] = useState([]);

    // Fetch all orders
    const fetchOrders = useCallback(() => {
        return axiosInstance.get('/orders.php')
            .then((response) => {
                console.log("Backend response:", response.data);
                setOrders(response.data);
                return response.data; // Devolver los datos para .then en el componente
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                throw error; // Lanzar error para manejar en el componente que llama
            });
    }, []);

    // Fetch a specific order by ID
    const fetchOrderById = useCallback((orderId) => {
        return axiosInstance.get(`/orders.php?id=${orderId}`)
            .then((response) => {
                console.log("Fetched order data:", response.data);
                return response.data; // Devolver los datos para .then en el componente
            })
            .catch((error) => {
                console.error(`Error fetching order with ID ${orderId}:`, error);
                throw error;
            });
    }, []);

    // Create a new order
    const createOrder = (orderData) => {
        return axiosInstance.post('/orders.php', orderData)
            .then((response) => {
                console.log("Order created:", response.data);
                return fetchOrders() // Actualiza las órdenes y devuelve la nueva lista
                    .then(() => response.data); // Devolver los datos de la orden creada
            })
            .catch((error) => {
                console.error("Error creating order:", error);
                throw error;
            });
    };

    // Update an existing order
    const updateOrder = (orderData) => {
        return axiosInstance.put('/orders.php', orderData)
            .then((response) => {
                console.log("Order updated:", response.data);
                return fetchOrders() // Actualiza las órdenes y devuelve la nueva lista
                    .then(() => response.data);
            })
            .catch((error) => {
                console.error("Error updating order:", error);
                throw error;
            });
    };

    // Delete an order
    const deleteOrder = (orderId) => {
        return axiosInstance.delete(`/orders.php?id=${orderId}`)
            .then((response) => {
                console.log("Order deleted:", response.data);
                return fetchOrders() // Actualiza las órdenes y devuelve la nueva lista
                    .then(() => response.data);
            })
            .catch((error) => {
                console.error("Error deleting order:", error);
                throw error;
            });
    };

    // Local cart management methods
    const addProductToOrder = (product) => {
        const existingProduct = orderItems.find(item => item.id === product.id);
        const currentQuantity = existingProduct ? existingProduct.quantity : 0;

        if (currentQuantity + 1 > product.Stock) {
            alert('Insufficient stock available for this product.');
            return;
        }

        if (existingProduct) {
            setOrderItems(orderItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setOrderItems([...orderItems, { ...product, quantity: 1 }]);
        }
    };

    const decreaseProductQuantity = (product) => {
        const existingProduct = orderItems.find(item => item.title === product.title);

        if (existingProduct.quantity > 1) {
            setOrderItems(orderItems.map(item =>
                item.title === product.title
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ));
        } else {
            removeProductFromOrder(product);
        }
    };

    const removeProductFromOrder = (product) => {
        setOrderItems(orderItems.filter(item => item.title !== product.title));
    };

    return (
        <OrderContext.Provider value={{
            orderItems,
            orders,
            fetchOrders,
            fetchOrderById,
            addProductToOrder,
            decreaseProductQuantity,
            removeProductFromOrder,
            createOrder,
            updateOrder,
            deleteOrder,
            setOrderItems
        }}>
            {children}
        </OrderContext.Provider>
    );
};
