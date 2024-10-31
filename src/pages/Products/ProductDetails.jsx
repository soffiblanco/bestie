import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaBagShopping } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductDetails.css';
import { baseUrl } from '../../config.js';
import { useAuth } from '../../Auth/AuthContext.js';
import { OrderContext } from '../../pages/Orders/OrderContexts';
import ecommerce_fetch from '../../services/ecommerce_fetch.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { ID_Product } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showNewCommentBox, setShowNewCommentBox] = useState(false);
    const [replyBoxIndex, setReplyBoxIndex] = useState(null);
    const [editingCommentIndexes, setEditingCommentIndexes] = useState(null);
    const [showChildren, setShowChildren] = useState({});
    const [users, setUsers] = useState([]);
    const editedCommentRef = useRef("");
    const { userData } = useAuth();
    const textareaRef = useRef(null);

    const { addProductToOrder } = useContext(OrderContext);

    useEffect(() => {
        // Fetch product
        ecommerce_fetch(`${baseUrl}/products.php?ID_Product=${ID_Product}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching product details');
                }
                return response.json();
            })
            .then(data => {
                const foundProduct = data.data.find(item => item.ID_Product_Product === ID_Product);
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
        ecommerce_fetch(`${baseUrl}/comment.php?ID_Product_Product=${ID_Product}`)
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

        // Fetch users
        ecommerce_fetch(`${baseUrl}/users.php`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching users');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data.data)) {
                    setUsers(data.data);
                } else {
                    setUsers([]);
                }
                console.log('Usuarios obtenID_Productos:', data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setError('Error al obtener los usuarios.');
            });
    }, [ID_Product]);

    const getUserName = (userID_Product) => {
        console.log('Buscando usuario con ID_Product:', userID_Product);
        const user = users.find(user => user.ID_Product_User == userID_Product);
        if (user) {
            console.log('Usuario encontrado:', user);
            return user.Name;
        } else {
            console.log('Usuario no encontrado, usando valor predeterminado');
            return 'Unknown User';
        }
    };

    const handleAddComment = () => {
        const ID_Product_user = userData.ID_Product_user;
        if (newComment.trim() !== "") {
            const newCommentData = {
                ID_Product_User: ID_Product_user, // Utilizar el ID_Product de usuario de la sesión actual
                ID_Product_Product: ID_Product,
                Comment: newComment,
            };
    
      
            fetch(`${baseUrl}/comment.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                console.log('Respuesta del servID_Productor al agregar comentario:', data);
                
                const newCommentWithID_Product = { ...newCommentData, ID_Product_Comment: data.ID_Product_Comment, children: [], User: getUserName(newCommentData.ID_Product_User) };
                setComments([...comments, newCommentWithID_Product]);
                setNewComment("");
                setShowNewCommentBox(false);
            })
            .catch(error => {
                console.error('Error adding comment:', error);
            });
        }
    };
    
    const handleAddReply = (parentIndexes, reply) => {
        const ID_Product_user = userData.ID_Product_user;
        if (reply.trim() !== "") {
            const updatedComments = JSON.parse(JSON.stringify(comments)); // Copia profunda del arreglo
            let current = updatedComments;
    
            // Navegar al comentario padre correcto usando los índices
            parentIndexes.forEach((index) => {
                if (current[index]) {
                    current = current[index].children;
                } else {
                    console.error(`Índice inválID_Producto: ${index} en parentIndexes`, parentIndexes);
                    return; // Detenemos la función si encontramos un índice inválID_Producto
                }
            });
    
            // Obtener el comentario padre usando parentIndexes y verificar ID_Product_Comment
            let parentComment = comments[parentIndexes[0]];
            for (let i = 1; i < parentIndexes.length; i++) {
                if (parentComment && parentComment.children[parentIndexes[i]]) {
                    parentComment = parentComment.children[parentIndexes[i]];
                } else {
                    console.error(`Índice inválID_Producto en la jerarquía de comentarios: ${parentIndexes[i]}`, parentIndexes);
                    return; // Detenemos la función si encontramos un índice inválID_Producto
                }
            }
    
            if (!parentComment || !parentComment.ID_Product_Comment) {
                console.error('No se encontró el ID_Product_Comment del comentario padre', parentComment);
                return;
            }
    
            const newReplyData = {
                ID_Product_User: ID_Product_user, // Utilizar el ID_Product de usuario de la sesión actual
                ID_Product_Product: ID_Product,
                Comment: reply,
                ID_Product_Comment_Father: parentComment.ID_Product_Comment,
            };
    
            console.log('Datos de la nueva respuesta antes de enviar:', newReplyData);
    
            // Hacer solicitud POST para agregar la nueva respuesta al backend
            fetch(`${baseUrl}/comment.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReplyData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error adding reply');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servID_Productor al agregar respuesta:', data);
    
                // Agregar la nueva respuesta a la copia del comentario actual
                current.push({ ...newReplyData, ID_Product_Comment: data.ID_Product_Comment, children: [], User: getUserName(newReplyData.ID_Product_User) });
    
                // Actualizar el estado de los comentarios
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
                    ID_Product_Comment: commentToUpdate.ID_Product_Comment,
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

    const handleCancelEdit = () => {
        setEditingCommentIndexes(null);
        editedCommentRef.current = "";
    };

    const handleAddToCart = () => {
        if (product) {
            addProductToOrder({
                ID_Product: product.ID_Product_Product,
                title: product.Product,
                price: product.Price,
                image: product.Product_Image,
                quantity: 1,
            });
            toast.success('Your product has been added to your order');
        }
    };

    const toggleShowChildren = (indexPath) => {
        setShowChildren(prevState => ({
            ...prevState,
            [indexPath]: !prevState[indexPath]
        }));
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!product) {
        return <div className="spinner-border text-primary" role="status">
            <span className="sr-only">  Loading.</span>
        </div>;
    }

    const CommentItem = ({ comment, parentIndexes = [] }) => {
        const [replyText, setReplyText] = useState("");

        const isEditing = editingCommentIndexes && editingCommentIndexes.join() === parentIndexes.join();
        const indexPath = parentIndexes.join("-");
        const isUserComment = userData.ID_Product_user == comment.ID_Product_User;

        return (
            <li className="list-group-item comment-item mb-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
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
                            <button className="btn btn-secondary mt-2 ms-2" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <span className="me-2 flex-grow-1"><strong>{comment.User ? comment.User : getUserName(comment.ID_Product_User)}:</strong> {comment.Comment}</span>
                            {isUserComment && (
                                <div className="edit-icon-container">
                                    <button className="btn btn-link edit-icon" onClick={() => handleEditComment(parentIndexes)}>
                                        <FaEdit />
                                    </button>
                                </div>
                            )}
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
                    <div className="mb-2">
                        <button className="btn btn-link mb-2" onClick={() => toggleShowChildren(indexPath)}>
                            {showChildren[indexPath] ? 'HID_Producte Replies' : 'Show Replies'} ({comment.children.length})
                        </button>
                        {showChildren[indexPath] && (
                            <ul className="list-group mt-4" style={{ marginLeft: '20px', paddingLeft: '20px', borderLeft: '2px solID_Product #b885e7' }}>
                                {comment.children.map((reply, replyIndex) => (
                                    <CommentItem
                                        key={replyIndex}
                                        comment={reply}
                                        parentIndexes={[...parentIndexes, replyIndex]}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                <button className="btn btn-link reply-button mt-2" onClick={() => setReplyBoxIndex(parentIndexes.join("-"))}>
                    Reply
                </button>
            </li>
        );
    };

    return (
        <>
      <ToastContainer position="top-right" />
        <div className="containerProduct mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={product.Product_Image} alt={product.Product} className="img-fluID_Product rounded" />
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
                    <div className="mt-4">
                        <textarea
                            className="form-control"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        ></textarea>
                        <button className="btn btn-secondary mt-3" onClick={handleAddComment}>Add comment</button>
                    </div>
                ) : (
                    <button className="btn btn-secondary mt-3" onClick={() => setShowNewCommentBox(true)}>Add Comment</button>
                )}
            </div>
        </div>
        </>
    );
};

export default ProductDetails;
