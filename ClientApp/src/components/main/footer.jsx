import React from "react";
import "./footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDiscord, faInstagram, faFacebook} from '@fortawesome/free-brands-svg-icons';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="foot">
            <div className="container">
                <div className="row">
                    <div className="d-flex justify-content-center mb-2">
                        <Link className="link-edit footer-link" to="https://www.instagram.com/alkoholici_sro/"> <FontAwesomeIcon icon={faInstagram} size="2xl" className="mx-2"/> </Link>
                        <FontAwesomeIcon icon={faFacebook} size="2xl" className="mx-2"/>
                        <Link className="link-edit footer-link" to="https://discord.gg/br7RVWnD"><FontAwesomeIcon icon={faDiscord} size="2xl" className="mx-2"/></Link>
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-2">
                    <Link to="/" className="footer-text black-text footer-link" style={{ textDecoration: 'none' }}>About us</Link>
                </div>
                <div className="d-flex justify-content-center mt-2">
                    <p className="footer-text ">© 2023 OnlyShare</p>
                </div>
            </div>
        </footer>
    );
}


export default Footer;
