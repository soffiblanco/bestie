import React from 'react';
import './PhotoCard.css';

// Ejemplo de categorías con imágenes
const categories = [
    {
        name: 'Alimento',
        products: [
            { name: 'Perro', description: 'Alimento para perro', image: '/path/to/perro-alimento.jpg' },
            { name: 'Gato', description: 'Alimento para gato', image: '/path/to/gato-alimento.jpg' },
            { name: 'Peces', description: 'Alimento para peces', image: '/path/to/peces-alimento.jpg' },
            { name: 'Tortugas', description: 'Alimento para tortugas', image: '/path/to/tortugas-alimento.jpg' },
            { name: 'Aves', description: 'Alimento para aves', image: '/path/to/aves-alimento.jpg' }
        ]
    },
    {
        name: 'Juguetes',
        products: [
            { name: 'Perro', description: 'Juguetes para perro', image: '/path/to/perro-juguetes.jpg' },
            { name: 'Gato', description: 'Juguetes para gato', image: '/path/to/gato-juguetes.jpg' }
        ]
    },
    {
        name: 'Hogar',
        products: [
            { name: 'Perro', description: 'Accesorios para el hogar para perro', image: '/path/to/perro-hogar.jpg' },
            { name: 'Gato', description: 'Accesorios para el hogar para gato', image: '/path/to/gato-hogar.jpg' },
            { name: 'Peces', description: 'Accesorios para el hogar para peces', image: '/path/to/peces-hogar.jpg' },
            { name: 'Tortugas', description: 'Accesorios para el hogar para tortugas', image: '/path/to/tortugas-hogar.jpg' },
            { name: 'Aves', description: 'Accesorios para el hogar para aves', image: '/path/to/aves-hogar.jpg' }
        ]
    },
    {
        name: 'Accesorios',
        products: [
            { name: 'Perro', description: 'Accesorios para perro', image: '/path/to/perro-accesorios.jpg' },
            { name: 'Gato', description: 'Accesorios para gato', image: '/path/to/gato-accesorios.jpg' }
        ]
    },
    {
        name: 'Medicina',
        products: [
            { name: 'Perro', description: 'Medicina para perro', image: '/path/to/perro-medicina.jpg' },
            { name: 'Gato', description: 'Medicina para gato', image: '/path/to/gato-medicina.jpg' },
            { name: 'Peces', description: 'Medicina para peces', image: '/path/to/peces-medicina.jpg' },
            { name: 'Tortugas', description: 'Medicina para tortugas', image: '/path/to/tortugas-medicina.jpg' },
            { name: 'Aves', description: 'Medicina para aves', image: '/path/to/aves-medicina.jpg' }
        ]
    },
    {
        name: 'Ropa',
        products: [
            { name: 'Perro', description: 'Ropa para perro', image: '/path/to/perro-ropa.jpg' },
            { name: 'Gato', description: 'Ropa para gato', image: '/path/to/gato-ropa.jpg' }
        ]
    }
];


const PhotoCard = () => {
  return (
    <div className="photo-card">
      <div className="photo-card-category-list">
        {categories.map((category, index) => (
          <div key={index} className="photo-card-category-item">
            <h3 className="photo-card-category-title">{category.name}</h3>
            <img src={category.image} alt={category.name} className="photo-card-category-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCard;


