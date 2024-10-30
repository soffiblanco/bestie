import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaBagShopping } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductDetails.css';
import { baseUrl } from '../../config.js'
import { OrderContext } from '../../pages/Orders/OrderContexts';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';

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
    const textareaRef = useRef(null);

    const { addProductToOrder } = useContext(OrderContext);

    useEffect(() => {
        // Fetch product
        ecommerce_fetch(`${baseUrl}/products.php?id=${id}`)
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

        // Fetch comments for product
        ecommerce_fetch(`${baseUrl}/comment.php?ID_Product=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching comments');
                }
                return response.json();
            })
            .then(data => {
                setComments(data);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
                setError('Error al obtener los comentarios.');
            });
    }, [id]);

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            const newCommentData = {
                ID_User: 140, // Asumiendo que el ID de usuario se conoce y está hardcodeado por ahora
                ID_Product: id,
                Comment: newComment,
            };
    
            // Hacer solicitud POST para agregar un nuevo comentario en el backend
            fetch(`${baseUrl}/comment.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de que el Content-Type sea correcto
                },
                body: JSON.stringify(newCommentData), // Convertir a JSON string
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error adding comment');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor al agregar comentario:', data);
                
                const newCommentWithID = { ...newCommentData, ID_Comment: data.ID_Comment, children: [] };
                setComments([...comments, newCommentWithID]);
                setNewComment("");
                setShowNewCommentBox(false);
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
        }
    };
    
    
    const handleAddReply = (parentIndexes, reply) => {
        if (reply.trim() !== "") {
            const updatedComments = JSON.parse(JSON.stringify(comments)); // Copia profunda del arreglo
            let current = updatedComments;
    
            // Recorrer parentIndexes y hacer log de current
            parentIndexes.forEach((index, i) => {
                if (current[index]) {
                    current = current[index].children;
                    console.log(`Paso ${i + 1} - Current después de parentIndexes[${index}]:`, current);
                } else {
                    console.error(`Índice inválido: ${index} en parentIndexes`, parentIndexes);
                    return;
                }
            });
    
            // Obtener el comentario padre y verificar su ID_Comment
            const parentCommentIndex = parentIndexes[parentIndexes.length - 1];
            let parentComment = comments[parentIndexes[0]];
    
            for (let i = 1; i < parentIndexes.length; i++) {
                parentComment = parentComment.children[parentIndexes[i]];
            }
    
            if (!parentComment || !parentComment.ID_Comment) {
                console.error(`No se encontró ID_Comment en el comentario padre`, parentComment);
                return;
            }
    
            const newReplyData = {
                ID_User: 140, // Asumiendo que el ID de usuario se conoce y está hardcodeado por ahora
                ID_Product: id,
                Comment: reply,
                ID_Comment_Father: parentComment.ID_Comment,
            };
    
            console.log('Datos de la nueva respuesta antes de enviar:', newReplyData);
    
            // Hacer solicitud POST para agregar una nueva respuesta en el backend
            fetch(`${baseUrl}/comment.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de que el Content-Type sea correcto
                },
                body: JSON.stringify(newReplyData), // Convertir a JSON string
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error adding reply');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor al agregar respuesta:', data);
                current.push({ ...newReplyData, ID_Comment: data.ID_Comment, children: [] });
                setComments(updatedComments);
                setReplyBoxIndex(null);
            })
            .catch(error => {
                console.error('Error adding reply:', error);
            });
        }
    };
    
    


    const handleEditComment = (parentIndexes) => {
        let current = comments;
        parentIndexes.forEach((index, i) => {
            if (i === parentIndexes.length - 1) {
                editedCommentRef.current = current[index].Comment;
            } else {
                current = current[index].children;
            }
        });
        setEditingCommentIndexes(parentIndexes);
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 0);
    };

    const handleSaveEditedComment = () => {
        if (editedCommentRef.current.trim() !== "") {
            const updatedComments = [...comments];
            let current = updatedComments;

            editingCommentIndexes.forEach((index, i) => {
                if (i === editingCommentIndexes.length - 1) {
                    current[index].Comment = editedCommentRef.current;
                } else {
                    current = current[index].children;
                }
            });

            // Make PUT request to update comment in the backend
            const commentToUpdate = current[editingCommentIndexes[editingCommentIndexes.length - 1]];
            ecommerce_fetch(`${baseUrl}/comment.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ID_Comment: commentToUpdate.ID_Comment,
                    Comment: editedCommentRef.current,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating comment');
                }
                return response.json();
            })
            .then(data => {
                console.log('Comment updated successfully:', data);
                setComments(updatedComments);
                setEditingCommentIndexes(null);
                editedCommentRef.current = "";
            })
            .catch(error => {
                console.error('Error updating comment:', error);
            });
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
                                ref={textareaRef}
                                defaultValue={editedCommentRef.current}
                                onChange={(e) => (editedCommentRef.current = e.target.value)}
                                autoFocus
                            ></textarea>
                            <button className="btn btn-success mt-2" onClick={handleSaveEditedComment}>Save</button>
                        </div>
                    ) : (
                        <>
                            <span className="me-2 flex-grow-1">{comment.Comment}</span>
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

                {comment.children && comment.children.length > 0 && (
                    <ul className="list-group mt-3">
                        {comment.children.map((reply, replyIndex) => (
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
