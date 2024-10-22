import React, { useContext } from 'react';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Order.css';
import { useNavigate } from 'react-router-dom';


function Order() {
    const { orderItems, addProductToOrder, removeProductFromOrder, decreaseProductQuantity } = useContext(OrderContext);

    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const navigate = useNavigate(); // Para redirigir al usuario

    const handleProceedToPayment = () => {
        navigate('/payment'); // Redirige a la página de pago
    };

    return (
        <div className="container-fluid mt-5 order-container">
            <h2 className="text-center order-title">Orden</h2>
            {orderItems.length === 0 ? (
                <p className="text-center empty-order">No hay productos en la orden.</p>
            ) : (
                <ul className="list-group mb-4 order-list">
                    {orderItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center order-item">
                            <div className="d-flex align-items-center">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="img-thumbnail order-item-image"
                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                />
                                <div className="order-item-info">
                                    <h6 className="order-item-title">{item.title}</h6>
                                    <p className="mb-0 order-item-price">Q{item.price} x {item.quantity}</p>
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

            <h3 className="text-center order-total">Total: Q{total.toFixed(2)}</h3>

            {orderItems.length > 0 && (
                <button className="btn btn-success btn-block mt-4 add-product-button" onClick={handleProceedToPayment}>
                    Finalizar Compra
                </button>
            )}
        </div>
    );
}

export default Order;
