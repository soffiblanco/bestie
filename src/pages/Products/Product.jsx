import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import { useNavigate } from 'react-router-dom';
import './Product.css';
import { baseUrl } from '../../config.js';
import ecommerce_fetch from '../../services/ecommerce_fetch';

function Product({ productId, title: initialTitle, description: initialDescription, price: initialPrice, image: initialImage }) {
    const { addProductToOrder } = useContext(OrderContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const [price, setPrice] = useState(initialPrice || '');
    const [image, setImage] = useState(initialImage || '');
    const [loading, setLoading] = useState(!initialTitle); // Para mostrar el cargando si no hay datos iniciales
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    useEffect(() => {
        if (!initialTitle) { // Solo hacemos la llamada a la API si no hay props iniciales
             ecommerce_fetch(`${baseUrl}/products.php?id=${productId}`)
                .then(response => response.json())
                .then(data => {
                    const productData = data.data[0]; 
                    setTitle(productData.Product);
                    setDescription(productData.Product_Description);
                    setPrice(productData.Price);
                    setImage(productData.Product_Image);
                    setLoading(false); 
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                    setLoading(false);
                });
        }
        
        fetch(`http://localhost/apis/comments.php?product_id=${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching comments');
            }
            return response.json();
        })
        .then(data => {
            setComments(data.comments);
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });

    }, [productId, initialTitle]);

    const handleAddToOrder = () => {
        const product = {
            id: productId,
            title,
            price,
            image,
        };
        addProductToOrder(product); 
    };

    const handleViewDetails = (productId) => {
        navigate(`/CatalogProducts/${category}/${subcategory}/product/:${productId}`); // Redirige a la página individual del producto
    };

    if (loading) {
        return <div>Cargando detalles del producto...</div>;
    }
    

    return (
        <div className='container-product'>
            <img 
                className='image-product'
                src={image}  // Usamos la imagen directamente de la API
                alt={title}
            />

            <div className='info-product'>
                <p className='title'>{title}</p>
                <p className='description'>{description}</p>
                <p className='price'>Q{price}</p>
                <button className='see-details' onClick={handleViewDetails}>
                    Ver más detalles
                </button>
                <button className='see-more' onClick={handleAddToOrder}>
                    Agregar a la Orden
                </button>
            </div>

  
        </div>
    );
}

export default Product;

