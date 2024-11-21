import React, { useEffect, useState } from "react";
import "../footer/footer.css";
import { FaFacebook, FaInstagramSquare, FaWhatsappSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { baseUrl } from "../../config";
import ecommerce_fetch from "../../services/ecommerce_fetch";

const Footer = () => {
    const [footerConfig, setFooterConfig] = useState([]);
    const [footerLinks, setFooterLinks] = useState([]);
    const [footerImages, setFooterImages] = useState([]);

    // Cargar datos del footer desde la base de datos
    useEffect(() => {
        ecommerce_fetch(`${baseUrl}/getFooter.php`)
            .then((response) => response.json())
            .then((data) => {
                setFooterConfig(data.footer_config || []);
                setFooterLinks(data.footer_links || []);
                setFooterImages(data.footer_images || []);
            })
            .catch((error) => console.error("Error fetching footer data:", error));
    }, []);

    return (
        <footer className="footer bg-warning text-white py-4">
            <div className="container">
                <div className="row">
                    {/* Iterar sobre las secciones del footer */}
                    {footerConfig.map((section) => (
                        <div key={section.ID_Footer_Config} className="col-md-3 mb-3">
                            <h5>{section.Section_Name}</h5>
                            <ul className="list-unstyled">
                                {/* Mostrar los enlaces relacionados con la sección */}
                                {footerLinks
                                    .filter((link) => link.ID_Menu === section.ID_Footer_Config)
                                    .map((link) => (
                                        <li key={link.ID_Footer_Link}>
                                            <a href={link.Link} className="text-white">
                                                {link.Text}
                                            </a>
                                        </li>
                                    ))}
                            </ul>

                            {/* Mostrar imágenes relacionadas con la sección */}
                            <div className="footer-images">
                                {footerImages
                                    .filter((image) => image.ID_Footer_Config === section.ID_Footer_Config)
                                    .map((image) => (
                                        <a key={image.ID_Image} href={image.Link || "#"}>
                                            <img
                                                src={image.Image}
                                                alt={image.Alt_Text || "Footer Image"}
                                                className="footer-image"
                                            />
                                        </a>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="bg-white" />

                {/* Copyright */}
                <div className="text-center">
                    <p>© 2024 Bestie Paws. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


