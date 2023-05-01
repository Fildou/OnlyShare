import React, { useEffect, useState } from "react";
import OnlyShareLogo from "../resources/OnlyShare-BL.png";
import "./MainPage.css";
import {Link, Navigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
    
    return (
        <div>
            <div className="logo-and-square d-flex align-items-center">
                <div className="square-left"></div>
                <img src={OnlyShareLogo} alt="logo" className="d-block m-auto m" />
                <div className="square-right"></div>
            </div>
            <div className="form-group mt-5">
                <h1 className="d-flex justify-content-center text-style">ONLY SHARE</h1>
                <p className="d-flex justify-content-center slogan-text">Share your&nbsp;<p className="d-flex justify-content-center slogan-text-highlight">knowledge</p>, elevate the&nbsp;<p className="d-flex justify-content-center slogan-text-highlight-second">community</p></p>
            </div>
            <div className="row row-main-page">
                <div className="card-main-page">
                    <div className="container">
                        <h4 className="main-text-title">Search, and Grow Your Expertise</h4>
                        <p className="main-text-paragraph">Join the OnlyShare Community: Ask, Answer, and Grow Your Expertise</p>
                        <Link className="btn btn-outline-dark main-text-link" to="/questions" style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faQuestion} /> Discover content</Link>
                    </div>
                </div>
                <div className="card-main-page login-card">
                    <div className="container">
                        <h4 className="main-text-title">Join community</h4>
                        <p className="main-text-paragraph">Join the OnlyShare community and tap into a wealth of knowledge and expertise</p>
                        <Link className="btn btn btn-outline-dark main-text-link" to="/register" style={{ textDecoration: 'none' }}><FontAwesomeIcon icon={faUserPlus} /> Join the community</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MainPage;