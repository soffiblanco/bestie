// Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCarousel from './ProductCarousel'; 
import './Home.css';
import conejo from '../../assets/conejo.jpeg';
import gatoGrande from '../../assets/gatoGrande.jpeg';
import gatoPequeño from '../../assets/gatoPequeño.jpeg';
import hamster from '../../assets/hamster.jpeg';
import perroGrande from '../../assets/perroGrande.jpeg';
import perroPequeño from '../../assets/perroPequeño.jpeg';
import runningVideo from '../../assets/alpacaGif.mp4';


const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const categories = [
    {
      name: 'Gatos',
      products: [
        { name: 'Gato grande', description: 'Gato grande', image: gatoGrande },
        { name: 'Gato pequeño', description: 'Gato pequeño', image: gatoPequeño },
      ],
    },
    {
      name: 'Perros',
      products: [
        { name: 'Perro grande', description: 'Perro grande', image: perroGrande },
        { name: 'Perro pequeño', description: 'Perro pequeño', image: perroPequeño },
      ],
    },
    {
      name: 'Roedores',
      products: [
        { name: 'Hamster', description: 'Hamster', image: hamster },
        { name: 'Conejo', description: 'Conejo', image: conejo },
      ],
    },
  ];

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Oculta el círculo después de la expansión
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        setFadeOut(true); // Aplicar la clase de desvanecimiento
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 500); // Tiempo que coincide con la duración de la transición de opacidad

        return () => clearTimeout(hideTimer);
      }, 1000); // Tiempo que coincide con la duración de la expansión

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      setFadeOut(false);
    }
  }, [isExpanded]);

  return (
    <div className="home">
      <p className="intro-text">Where every pawprint leaves a heartprint</p>
      {/* Círculo animado con el video en el centro */}
      {isVisible && (
        <div className={`circle ${isExpanded ? 'expanded' : ''} ${fadeOut ? 'fade-out' : ''}`}>
          
          <video
            src={runningVideo}
            className="circle-video"
            autoPlay
            loop
            muted
          />
        </div>
      )}
      {/* Título fuera del contenedor del carrusel para que siempre esté arriba */}
      <h1 className="carousel-title">Productos Aleatorios</h1>
      {/* Mostrar el carrusel al frente y más abajo */}
      <div className="carousel-container">
        <ProductCarousel categories={categories} numProducts={3} interval={3000} />
      </div>
    </div>
  );
};

export default Home;








