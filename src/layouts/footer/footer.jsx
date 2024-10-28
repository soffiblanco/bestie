import React from 'react';
import '../footer/footer.css';
import { FaFacebook, FaInstagramSquare, FaWhatsappSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className='footer bg-warning text-white py-4'> {/* bg-warning y text-white son clases Bootstrap */}
            <div className='container'>
                <div className='row'>
                    {/* Enlaces Rápidos */}
                    <div className='col-md-2 mb-2'>
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/categories" className="text-white">Categories</a></li>
                            <li><a href="/orders" className="text-white">My Orders</a></li>
                            <li><a href="/login" className="text-white">Login / Register</a></li>
                            <li><a href="/faq" className="text-white">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Información Legal */}
                    <div className='col-md-2 mb-2'>
                        <h5>Legal</h5>
                        <ul className="list-unstyled">
                            <li><a href="/terms" className="text-white">Terms and Conditions</a></li>
                            <li><a href="/privacy" className="text-white">Privacy Policy</a></li>
                            <li><a href="/returns" className="text-white">Return Policy</a></li>
                            <li><a href="/shipping" className="text-white">Shipping Policy</a></li>
                        </ul>
                    </div>

                    {/* Servicio al Cliente */}
                    <div className='col-md-2 mb-2'>
                        <h5>Customer Service</h5>
                        <ul className="list-unstyled">
                            <li><a href="/contact" className="text-white">Contact Us</a></li>
                            <li><a href="/support" className="text-white">Support Center</a></li>
                            <li>Phone: +502 5555 5555</li>
                            <li>Email: support@bestiepaws.com</li>
                        </ul>
                    </div>

                    {/* Redes Sociales */}
                    <div className='col-md-2 mb-2'>
                        <h5>Coming Soon on</h5>
                        <div className='d-flex justify-content-start'>
                            <a href="#" className="text-white me-3"><FaFacebook size={24} /></a>
                            <a href="#" className="text-white me-3"><FaSquareXTwitter size={24} /></a>
                            <a href="#" className="text-white me-3"><FaInstagramSquare size={24} /></a>
                            <a href="#" className="text-white me-3"><FaWhatsappSquare size={24} /></a>
                        </div>
                    </div>
                </div>

                <hr className="bg-white" />

                {/* Copyright */}
                <div className='text-center'>
                    <p>© 2024 Bestie Paws. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
