import React, { useEffect, useState } from 'react';
import './Home.css';
import runningVideo from '../../assets/alpacaGif.mp4';
import Carousel from '../../components/Carousel/Carousel';
import PhotoCard from '../../components/PhotoCard/PhotoCard';

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
      <div className="header-spacer"></div>

      {/* Contenedor del título y el círculo */}
      <div className="title-circle-container">
        <p className="intro-text">Where every pawprint leaves a heartprint</p>
        {isVisible && (
          <div className="circle-container">
            <div className={`circle ${isExpanded ? 'expanded' : ''}`}>
              <video
                src={runningVideo}
                className="circle-video"
                autoPlay
                loop
                muted
              />
            </div>
          </div>
        )}
      </div>

      {/* Contenedor del carrusel */}
      <div className="card">
        <div className="carousel-container">
          <Carousel categories={[]} numProducts={3} interval={3000} />
        </div>
      </div>

      {/* PhotoCard */}
      <PhotoCard />
    </div>
  );
};

export default Home;









