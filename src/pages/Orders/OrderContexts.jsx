// OrderContext.js
import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orderItems, setOrderItems] = useState([]);

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
        <OrderContext.Provider value={{ orderItems, addProductToOrder, decreaseProductQuantity, removeProductFromOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
