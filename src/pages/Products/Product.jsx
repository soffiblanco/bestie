import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../../pages/Orders/OrderContexts'; // Importa el contexto
import { useNavigate } from 'react-router-dom';
import './Product.css';

function Product({ productId, title: initialTitle, description: initialDescription, price: initialPrice, image: initialImage }) {
    const { addProductToOrder } = useContext(OrderContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState(initialTitle || '');
    const [description, setDescription] = useState(initialDescription || '');
    const [price, setPrice] = useState(initialPrice || '');
    const [image, setImage] = useState(initialImage || '');
    const [loading, setLoading] = useState(!initialTitle); // Para mostrar el cargando si no hay datos iniciales

    useEffect(() => {
        if (!initialTitle) { // Solo hacemos la llamada a la API si no hay props iniciales
            fetch(`http://localhost/apis/products.php?id=${productId}`)
                .then(response => response.json())
                .then(data => {
                    const productData = data.data[0]; // Asegúrate de ajustar según la estructura de tu respuesta
                    setTitle(productData.Product);
                    setDescription(productData.Product_Description);
                    setPrice(productData.Price);
                    setImage(productData.Product_Image);
                    setLoading(false); // Quitamos el estado de cargando
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                    setLoading(false);
                });
        }
    }, [productId, initialTitle]);

    const handleAddToOrder = () => {
        const product = {
            id: productId,
            title,
            price,
            image,
        };
        addProductToOrder(product); // Agrega el producto a la orden
    };

    const handleViewDetails = () => {
        navigate(`/product/${productId}`); // Redirige a la página individual del producto
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

