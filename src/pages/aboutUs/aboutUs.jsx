import React from 'react';
import './aboutUs.css'; 
import Paws from '../../assets/Paws.png'; // Agrega el logo o una imagen relevante
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-us-container">
        <img src={Paws} alt="Bestie Paws Logo" className="hero-logo" />
        <h1 className="hero-title">Welcome to Bestie Paws</h1>
        <p className="hero-subtitle">
          Your trusted pet store in Guatemala, offering the best for your furry friends.
        </p>


        <h2 className="section-title text-center">Our Story</h2>
        <p className="about-description text-center">
          Founded in 2024, Bestie Paws started with a simple mission: to bring joy and care to all pets.
          As passionate pet lovers, we believe that every pet deserves the best, and that’s why we offer
          top-quality products for all kinds of pets – from dogs and cats to birds and fish. Located in
          the heart of Guatemala, we’re here to serve the local community with love and dedication.
        </p>

        <h2 className="section-title text-center mt-5">What We Offer</h2>
        <p className="about-description text-center">
          At Bestie Paws, we offer a wide range of products tailored for your pets’ needs:
        </p>
        <ul className="about-list">
          <li>Premium food for dogs, cats, birds, fish, and more.</li>
          <li>Fun and engaging toys for all pets.</li>
          <li>Stylish and comfortable accessories for every occasion.</li>
          <li>Essential health products to keep your pets happy and healthy.</li>
          <li>Home products to make your pets' environment as cozy as possible.</li>
        </ul>

        <h2 className="section-title text-center mt-5">Why Choose Us?</h2>
        <p className="about-description text-center">
          At Bestie Paws, we believe in delivering quality and care. We work with trusted brands to ensure
          that your pets get only the best. Our customer service team is always ready to help you find
          the perfect products for your beloved companions. From our wide selection to our commitment to
          satisfaction, we’re the pet store that truly cares.
        </p>

        <div className="contact-section text-center mt-5">
          <h3 className="contact-title">Get in Touch</h3>
          <p className="contact-info">Location: Guatemala City, Guatemala</p>
          <p className="contact-info">Phone: +502 5555 5555</p>
          <p className="contact-info">Email: support@bestiepaws.com</p>
        </div>
     
    </div>
  );
};

export default AboutUs;
