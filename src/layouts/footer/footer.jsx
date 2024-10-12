import React from 'react';
import '../footer/footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='footer'>
            <div className='sb__footer section__padding'>
                <div className='sb__footer-links'>
                    {/* Enlaces Rápidos */}
                    <div className='sb__footer-links_div'>
                        <h4>Quick Links</h4>
                        <a href="/categories"><p>Categories</p></a>
                        <a href="/orders"><p>My Orders</p></a>
                        <a href="/login"><p>Login / Register</p></a>
                        <a href="/faq"><p>FAQs</p></a>
                    </div>

                    {/* Información Legal */}
                    <div className='sb__footer-links_div'>
                        <h4>Legal</h4>
                        <a href="/terms"><p>Terms and Conditions</p></a>
                        <a href="/privacy"><p>Privacy Policy</p></a>
                        <a href="/returns"><p>Return Policy</p></a>
                        <a href="/shipping"><p>Shipping Policy</p></a>
                    </div>

                    {/* Servicio al Cliente */}
                    <div className='sb__footer-links_div'>
                        <h4>Customer Service</h4>
                        <a href="/contact"><p>Contact Us</p></a>
                        <a href="/support"><p>Support Center</p></a>
                        <p>Phone: +502 5555 5555</p>
                        <p>Email: support@bestiepaws.com</p>
                    </div>

                    {/* Redes Sociales */}
                    <div className='sb__footer-links_div'>
                        <h4>Coming Soon on</h4>
                        <div className='socialmedia'>
                            <p><FaFacebook /></p>
                            <p><FaSquareXTwitter /></p>
                            <p><FaInstagramSquare /></p>
                            <p><FaWhatsappSquare /></p>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Copyright */}
                <div className='sb__footer-below'>
                    <div className='sb__footer-copyright'>
                        <p>© 2024 Bestie Paws. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
