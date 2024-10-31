// OrderContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../services/axiosConfig'; 

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);
    const [orders, setOrders] = useState([]);

    // Memoiza fetchOrders para evitar que cambie en cada renderizado
    const fetchOrders = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/orders'); // Asegúrate de que esta ruta sea correcta
            console.log("Backend response:", response.data); // Verificar la respuesta del backend
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, []);

   
    // Crear una nueva orden
    const createOrder = async (orderData) => {
        try {
            const response = await axiosInstance.post('', orderData);
            console.log(response.data);
            fetchOrders(); // Actualiza la lista de órdenes
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    };

    // Actualizar una orden existente
    const updateOrder = async (orderData) => {
        try {
            const response = await axiosInstance.put('', orderData);
            console.log(response.data);
            fetchOrders();
            return response.data;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    };

    // Eliminar una orden
    const deleteOrder = async (orderId) => {
        try {
            const response = await axiosInstance.delete(`?id=${orderId}`);
            console.log(response.data);
            fetchOrders();
            return response.data;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    };

    // Métodos para manejar el carrito localmente
    const addProductToOrder = (product) => {
        const existingProduct = orderItems.find(item => item.title === product.title);

        if (existingProduct) {
            setOrderItems(orderItems.map(item =>
                item.title === product.title
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
            fetchOrders, // Asegúrate de exponer fetchOrders
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
