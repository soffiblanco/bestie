import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaBagShopping } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductDetails.css';
import { OrderContext } from '../../pages/Orders/OrderContexts';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showNewCommentBox, setShowNewCommentBox] = useState(false);
    const [replyBoxIndex, setReplyBoxIndex] = useState(null);
    const [editingCommentIndexes, setEditingCommentIndexes] = useState(null);
    const editedCommentRef = useRef("");

    const { addProductToOrder } = useContext(OrderContext);

    useEffect(() => {
        fetch(`http://localhost/apis/products.php?id=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching product details');
                }
                return response.json();
            })
            .then(data => {
                const foundProduct = data.data.find(item => item.ID_Product === id);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError('Producto no encontrado.');
                }
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                setError('Error al obtener los detalles del producto.');
            });
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            setComments([...comments, { comment: newComment, replies: [] }]);
            setNewComment("");
            setShowNewCommentBox(false);
        }
    };

    const handleAddReply = (parentIndexes, reply) => {
        if (reply.trim() !== "") {
            const updatedComments = [...comments];
            let current = updatedComments;

            parentIndexes.forEach((index) => {
                current = current[index].replies;
            });

            current.push({ comment: reply, replies: [] });
            setComments(updatedComments);
            setReplyBoxIndex(null);
        }
    };

    const handleEditComment = (parentIndexes) => {
        let current = comments;
        parentIndexes.forEach((index, i) => {
            if (i === parentIndexes.length - 1) {
                editedCommentRef.current = current[index].comment;
            } else {
                current = current[index].replies;
            }
        });
        setEditingCommentIndexes(parentIndexes);
    };

    const handleSaveEditedComment = () => {
        if (editedCommentRef.current.trim() !== "") {
            const updatedComments = [...comments];
            let current = updatedComments;

            editingCommentIndexes.forEach((index, i) => {
                if (i === editingCommentIndexes.length - 1) {
                    current[index].comment = editedCommentRef.current;
                } else {
                    current = current[index].replies;
                }
            });

            setComments(updatedComments);
            setEditingCommentIndexes(null);
            editedCommentRef.current = "";
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addProductToOrder({
                id: product.ID_Product,
                title: product.Product,
                price: product.Price,
                image: product.Product_Image,
                quantity: 1,
            });
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!product) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando detalles del producto...</span>
        </div>;
    }

    const CommentItem = ({ comment, parentIndexes = [] }) => {
        const [replyText, setReplyText] = useState("");
    
        const isEditing = editingCommentIndexes && editingCommentIndexes.join() === parentIndexes.join();
    
        return (
            <li className="list-group-item comment-item">
                <div className="d-flex align-items-center justify-content-between">
                    {isEditing ? (
                        <div>
                            <textarea
                                key={parentIndexes.join("-")}
                                className="form-control"
                                defaultValue={editedCommentRef.current}
                                onChange={(e) => (editedCommentRef.current = e.target.value)}
                                autoFocus
                            ></textarea>
                            <button className="btn btn-success mt-2" onClick={handleSaveEditedComment}>Save</button>
                        </div>
                    ) : (
                        <>
                            <span className="me-2 flex-grow-1">{comment.comment}</span>
                            <div className="edit-icon-container">
                                <button className="btn btn-link edit-icon" onClick={() => handleEditComment(parentIndexes)}>
                                    <FaEdit />
                                </button>
                            </div>
                        </>
                    )}
                </div>
    
                {replyBoxIndex === parentIndexes.join("-") && (
                    <div className="mt-3">
                        <textarea
                            className="form-control mb-2"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <button className="btn btn-secondary" onClick={() => {
                            handleAddReply([...parentIndexes], replyText);
                            setReplyText("");
                        }}>Add reply</button>
                    </div>
                )}
    
                {comment.replies && comment.replies.length > 0 && (
                    <ul className="list-group mt-3">
                        {comment.replies.map((reply, replyIndex) => (
                            <CommentItem
                                key={replyIndex}
                                comment={reply}
                                parentIndexes={[...parentIndexes, replyIndex]}
                            />
                        ))}
                    </ul>
                )}
                <button className="btn btn-link reply-button mt-2" onClick={() => setReplyBoxIndex(parentIndexes.join("-"))}>
                    Reply
                </button>
            </li>
        );
    };
    
    return (
        <div className="containerProduct mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.Product_Image} alt={product.Product} className="img-fluid rounded" />
                </div>
                <div className="col-md-6">
                    <h2 className="my-3">{product.Product}</h2>
                    <p className="h6">{product.Product_Description}</p>
                    <p className="h5">Price: ${product.Price}</p>
                    <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
                        <FaBagShopping className="me-2" /> Add to cart
                    </button>
                </div>
            </div>

            <div className="comments-section mt-5">
            <h1>Comments</h1>
            {comments.length > 0 ? (
                <ul className="list-group">
                    {comments.map((comment, index) => (
                        <CommentItem key={index} comment={comment} parentIndexes={[index]} />
                    ))}
                </ul>
            ) : (
                <p>No comments yet.</p>
            )}

            {showNewCommentBox ? (
                <div className="mt-3">
                    <textarea
                        className="form-control"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                    ></textarea>
                    <button className="btn btn-secondary mt-2" onClick={handleAddComment}>Add comment</button>
                </div>
            ) : (
                <button className="btn btn-secondary mt-3" onClick={() => setShowNewCommentBox(true)}>Add Comment</button>
            )}
        </div>
        </div>
    );
};

export default ProductDetails;
