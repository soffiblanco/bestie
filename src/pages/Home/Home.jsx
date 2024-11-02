import React, { useEffect, useState } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import Mosaic from '../../components/Mosaic/Mosaic';
import CarouselAuto from '../../components/CarouselAuto/CarouselAuto';
import ProductCarousel from '../../pages/Home/ProductCarousel';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

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
    <div className="container-fluid py-5"> {/* Clase container-fluid para ajustar el contenedor */}
      <div className="text-center mb-5">
        <h2 className="display-4 custom-green">Where every pawprint leaves a heartprint</h2> {/* Texto verde */}
      </div>

      <div className="row">
        <div className="col-12 mb-5">
          <div className="card text-white p-4 shadow" style={{ backgroundColor: 'blueviolet' }}> {/* Fondo blueviolet */}
            <h3 className="text-center mb-4 custom-green">Our Featured Products</h3> {/* Texto verde */}
            <div className="carousel-container">
              <CarouselAuto categories={[]} numProducts={4} interval={3000} />
            </div>
          </div>
        </div>
        
        <div className="col-12 mb-5">
          <div className="card text-white p-4 shadow" style={{ backgroundColor: 'blueviolet' }}> {/* Fondo blueviolet */}
            <h3 className="text-center mb-4 custom-green">Our Best-Selling Products</h3> {/* Texto verde */}
            <div className="carousel-container">
              <Carousel categories={[]} numProducts={3} interval={3000} />
            </div>
          </div>
        </div>

        <div className="col-12 mb-5">
          <div className="card text-white p-4 shadow" style={{ backgroundColor: 'blueviolet' }}> {/* Fondo blueviolet */}
            <h3 className="text-center mb-4 custom-green">Last Chance!</h3> {/* Texto verde */}
            <div className="carousel-container">
              <ProductCarousel />
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-center mb-4 custom-green">Categories</h3>
      <Mosaic />
    </div>
  );
};

export default Home;











