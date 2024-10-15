import React, { useEffect, useState } from 'react';
import './Home.css';
import Carousel from '../../components/Carousel/Carousel';
import PhotoCard from '../../components/PhotoCard/PhotoCard';
import Mosaic from '../../components/Mosaic/Mosaic';
import CarouselAuto from '../../components/CarouselAuto/CarouselAuto';
import ProductCarousel from '../../pages/Home/ProductCarousel';

const Home = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsExpanded(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => setIsVisible(false), 1500);
      return () => clearTimeout(timer);
    }
    setIsVisible(true);
  }, [isExpanded]);

  return (
    <div className="home">
      {/* Espaciador superior */}
        <p className="intro-text">Where every pawprint leaves a heartprint</p>
      {/* Contenedor del carrusel */}
      <div className="cardtwo">
        <div className="carousel-container">
          <CarouselAuto categories={[]} numProducts={4} interval={3000} />
        </div>
      </div>
      <div className="card">
        <div className="carousel-container">
          <Carousel categories={[]} numProducts={3} interval={3000} />
        </div>
      </div>
      <div className="card">
        <div className="carousel-container">
          <ProductCarousel />
        </div>
      </div>
      <Mosaic/>
    </div>
  );
};

export default Home;









