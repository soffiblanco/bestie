import React from 'react';
import '../footer/footer.css';
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";

const Footer=()=>{
    return (
        <div className='footer'>
            <div className='sb__footer section__padding'>
                <div className='sb__footer-links'>
                    <div className='sb__footer-links_div'>
                        <h4>For Business</h4>
                        <a href="/employer">
                        <p>Employer</p>
                        </a>
                        <a href="/healthplan">
                        <p>health pln</p>
                        </a>
                        <a href="/individual">
                        <p>individual</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Resources</h4>
                        <a href="/resource">
                        <p>resource center</p>
                        </a>
                        <a href="/resource">
                        <p>Testimonials</p>
                        </a>
                        <a href="/resource">
                        <p>STV</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                    <h4>Partners</h4>
                        <a href="/employer">
                        <p>Swing Tech</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Company</h4>
                        <a href='/about'>
                        <p>about</p>
                        </a>
                        <a href='/press'>
                        <p>press</p>
                        </a>
                        <a href='/career'>
                        <p>career</p>
                        </a>
                        <a href='/contact'>
                        <p>contact</p>
                        </a>
                    </div>
                    <div className='sb__footer-links_div'>
                        <h4>Coming soon on</h4>
                        <div className='socialmedia'>
                            <p><FaFacebook /></p>
                            <p><FaSquareXTwitter /></p>
                            <p><FaInstagramSquare /></p>
                            <p><FaWhatsappSquare /></p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className='sb__footer-below'>
                    <div className='sb__footer-copyright'>
                        <p>
                            @{new Date().getFullYear()} Bestie Paws. All right reserved.
                        </p>
                    </div>
                    <div className='sb__footer-below-links'>
                        <a href="/terms"> <div><p> terms & conditions</p></div></a>
                        <a href="/privacy"> <div><p> privacy</p></div></a>
                        <a href="/security"> <div><p> security</p></div></a>
                        <a href="/cokie"> <div><p> cookie declaration</p></div></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;