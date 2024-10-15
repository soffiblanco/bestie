// Order.jsx
import React, { useContext } from 'react';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import 'bootstrap/dist/css/bootstrap.min.css';

function Order() {
    const { orderItems, addProductToOrder, removeProductFromOrder, decreaseProductQuantity } = useContext(OrderContext);

    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Orden</h2>
            {orderItems.length === 0 ? (
                <p className="text-center">No hay productos en la orden.</p>
            ) : (
                <ul className="list-group mb-4">
                    {orderItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="img-thumbnail"
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div>
                                    <h6>{item.title}</h6>
                                    <p className="mb-0">Q{item.price} x {item.quantity}</p>
                                </div>
                            </div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => decreaseProductQuantity(item)}
                                >
                                    -
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => addProductToOrder(item)}
                                >
                                    +
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeProductFromOrder(item)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <h3 className="text-center">Total: Q{total.toFixed(2)}</h3>

            {orderItems.length > 0 && (
                <button className="btn btn-success btn-block mt-4">
                    Finalizar Compra
                </button>
            )}
        </div>
    );
}

export default Order;


