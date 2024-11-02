import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../config';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaDollarSign, FaBoxOpen, FaTruck, FaCheck } from 'react-icons/fa';
import './ManagingOrder.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAuth} from '../../Auth/AuthContext.js';

const ManagingOrder = () => {
    const [users, setUsers] = useState([]);
    const { orderId } = useParams();
    const { fetchOrderById } = useContext(OrderContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState("");
    const [orderComments, setOrderComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [orderDetails, setOrderDetails] = useState([]);
    const {userData} = useAuth();

    const orderStatusList = [
        { name: 'Accepted', icon: <FaDollarSign className="status-icon" />, message: "The order is waiting for approval." },
        { name: 'In_Preparation', icon: <FaBoxOpen className="status-icon" />, message: "The order is ready to be prepared for delivery." },
        { name: 'On_Delivery_Route', icon: <FaTruck className="status-icon" />, message: "The order is on the delivery route." },
        { name: 'Delivered', icon: <FaCheck className="status-icon" />, message: "The order is complete." },
    ];

    useEffect(() => {
        fetchUsers();
        const loadOrder = async () => {
            try {
                const orderData = await fetchOrderById(orderId);
                if (orderData) {
                    setOrder(orderData);
                    fetchOrderDetails();
                } else {
                    setError("Order not found");
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Error fetching order");
            } finally {
                setLoading(false);
                fetchOrderComments();
            }
        };

        loadOrder();
    }, [orderId, fetchOrderById]);

    const fetchUsers = () => {
        fetch(`${baseUrl}/users.php`)
            .then(response => response.json())
            .then(data => {
                setUsers(Array.isArray(data.data) ? data.data : []);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error al obtener los usuarios.');
            });
    };

    const fetchOrderDetails = () => {
        fetch(`${baseUrl}/getOrderSummary.php?ID_Order=${orderId}`)
            .then(response => response.json())
            .then(data => {
                setOrderDetails(data.data || []);
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                toast.error('Error fetching order details');
            });
    };

    const fetchOrderComments = () => {
        fetch(`${baseUrl}/order_history.php?ID_Order=${orderId}`)
            .then(response => response.json())
            .then(data => {
                setOrderComments(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error('Error fetching order comments:', error);
                toast.error('Error fetching order comments');
            });
    };

    const getUserName = (userId) => {
        const user = users.find(user => user.ID_User === userId);
        return user ? user.Name : 'Unknown User';
    };

    const handleNextState = () => {
        setShowModal(true);
    };

    const handleCommentSubmit = () => {
        setShowModal(false);
        advanceOrderState();
        setComment("");
    };

    const handleEditComment = (commentId, currentComment) => {
        setEditingCommentId(commentId);
        setEditedComment(currentComment);
    };

    const saveEditedComment = () => {
        fetch(`${baseUrl}/order_history.php`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID_History_Order: editingCommentId,
                Change_Comment: editedComment,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Comment updated successfully") {
                toast.success("Comment updated successfully");
                setEditingCommentId(null);
                setEditedComment("");
                fetchOrderComments();
            } else {
                throw new Error("Failed to update comment");
            }
        })
        .catch(error => {
            console.error("Error updating comment:", error);
            toast.error("Error updating comment");
        });
    };

    const advanceOrderState = () => {
        const nextState = orderStatusList[currentStatusIndex + 1]?.name;
        if (!nextState) {
            alert("This order is already complete.");
            return;
        }
    
        const historyData = {
            ID_History_Order: order.ID_Order,
            ID_Order: order.ID_Order,
            ID_User: order.ID_User,
            State: nextState,
            Change_Date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            Change_Comment: comment,
            Is_Editable: 1
        };
    
        fetch(`${baseUrl}/order_history.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(historyData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "History order created") {
                toast.success("The change is completed");
                setShowModal(false);
                setComment(""); 
                fetchOrderComments(); 
            } else {
                throw new Error("Failed to advance order state.");
            }
        })
        .catch(error => {
            console.error("Error advancing order state:", error);
            toast.error("Error advancing order state.");
        });
    };

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div>{error}</div>;

    const currentStatusIndex = orderStatusList.findIndex(status => status.name === order.Order_State);
    const currentStatusMessage = currentStatusIndex !== -1 ? orderStatusList[currentStatusIndex].message : "Order state not recognized.";

    return (
        <>
            <ToastContainer position="top-right" />
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

                {/* Order Summary Section */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                    {/* Order Details Summary */}
                    <div className="card p-4 mt-4 order-summary-card" style={{ flex: 1 }}>
                        <h3 className="text-center order-summary-title">Order Summary</h3>
                        <ul className="list-group mb-4 order-list">
                            <li className="list-group-item"><strong>Order ID:</strong> {order.ID_Order}</li>
                            <li className="list-group-item"><strong>User Name:</strong> {order.Name}</li>
                            <li className="list-group-item"><strong>NIT:</strong> {order.NIT}</li>
                            <li className="list-group-item"><strong>Card Referencer:</strong> {order.Card_Referencer}</li>
                            <li className="list-group-item"><strong>Order Date:</strong> {new Date(order.Order_Date).toLocaleDateString()}</li>
                            <li className="list-group-item"><strong>Order Status:</strong> {order.Order_State}</li>
                            <li className="list-group-item"><strong>Shipping Address:</strong> {order.Direction_Order}</li>
                        </ul>
                    </div>

                    {/* Products and Pricing Summary */}
                    <div className="card p-4 mt-4 order-summary-card" style={{ flex: 1 }}>
                        <h3 className="text-center order-summary-title">Products in Order</h3>
                        <ul className="list-group mb-4 order-list">
                            {orderDetails.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center order-item">
                                    <div className="d-flex align-items-center">
                                        <img src={item.Product_Image || 'https://via.placeholder.com/50'} alt={item.Product_Name || 'Product'} className="img-thumbnail order-item-image" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                        <div className="order-item-info">
                                            <h6>{item.Product_Name || 'Product Title'}</h6>
                                            <p>Q{item.Unit_Price || 0} x {item.Product_Amount || 0}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Subtotal: Q{Number(item.Subtotal || 0).toFixed(2)}</strong>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Pricing Summary */}
                        <div className="order-summary text-center">
                            <p><strong>Shipping Price:</strong> Q{order.Shipping_Price}</p>
                            <p><strong>Surcharge:</strong> Q{order.Minimum_Amount_Surcharge}</p>
                            <h4>Total: Q{Number(order.Total || 0).toFixed(2)}</h4>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="card p-4 mt-4 order-comments-card">
                    <h3 className="text-center order-comments-title">Order Comments</h3>
                    {orderComments.length > 0 ? (
                        <ul className="list-group mb-4 order-comments-list">
                            {orderComments
                                .filter(comment => comment.State !== 'Accepted')
                                .map((comment, index) => (
                                    <li key={index} className="list-group-item">
                                        <p><strong>Change made by:</strong> {comment.Name}</p>
                                        <p><strong>Date:</strong> {new Date(comment.Change_Date).toLocaleDateString()}</p>
                                        <p><strong>Order advanced to state:</strong> {comment.State}</p>
                                        <p><strong>Comment:</strong> {editingCommentId === comment.ID_History_Order ? (
                                            <Form.Control
                                                as="textarea"
                                                value={editedComment}
                                                onChange={(e) => setEditedComment(e.target.value)}
                                            />
                                        ) : comment.Change_Comment}</p>
                                        {comment.State === "Delivered" && editingCommentId !== comment.ID_History_Order && comment.ID_User === userData.id_user && (
                                            <Button variant="link" onClick={() => handleEditComment(comment.ID_History_Order, comment.Change_Comment)}>
                                                Edit Comment
                                            </Button>
                                        )}
                                        {editingCommentId === comment.ID_History_Order && (
                                            <Button variant="primary" onClick={saveEditedComment}>
                                                Save
                                            </Button>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="text-center">No comments yet.</p>
                    )}
                </div>

                {/* Botón para avanzar de estado */}
                {currentStatusIndex < orderStatusList.length - 1 && order.Order_State !== "Delivered" && (
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={handleNextState}>Approve Next State</button>
                    </div>
                )}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-title-custom">Add Comment for Next State</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="comment">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment for the next state..."
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleCommentSubmit}>
                            Submit Comment
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default ManagingOrder;
