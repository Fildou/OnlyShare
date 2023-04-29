﻿import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import {
  Navbar,
  NavbarBrand,
  InputGroup,
  InputGroupText,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Nav,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../../middleware/authContext";
import OnlyShareLogo from "../resources/Logo.svg";


function NavMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, toggleLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toggleLogin();
    navigate("/login"); 
  };

  const handleQuestion = () => {
    navigate("/createQuestion");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCreateQuestion = () => {
    if (isLoggedIn) {
      navigate("/createQuestion");
    } else {
      navigate("/login");
    }
  };
  
  const handleProfile = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;
      navigate(`/profile/${userId}`);
    } else {
      navigate("/login");
    }
  };

  return (

        <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-color" light>
          <NavbarBrand tag={Link} style={{ textDecoration: 'none' }} to="/">
            <i><img src={OnlyShareLogo} alt="logo" className="logo"/></i>
            <span className="mx-2 logo-text">Onlyshare </span>
          </NavbarBrand>
          <Nav>
            { !isLoggedIn &&(
                <>
                  <Link className="btn btn-outline-info" to="/login" style={{ textDecoration: 'none' }}>Login</Link>
                  <Link className="mx-2 btn btn-outline-warning" to="/register" style={{ textDecoration: 'none' }}>Register</Link>
                </>
            )}
            {isLoggedIn && (
             <>
               <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                 <DropdownToggle caret color="outline-info" style={{ textDecoration: 'none' }}>
                   Account {isLoggedIn.username}
                 </DropdownToggle>
                 <DropdownMenu>
                   <DropdownItem onClick={handleProfile}>
                     <Link style={{ textDecoration: 'none' }}>Profile</Link>
                   </DropdownItem>
                   <DropdownItem>
                     <Link to="/UserQuestions" style={{ textDecoration: 'none' }}>My questions</Link>
                   </DropdownItem>
                 </DropdownMenu>
               </Dropdown>
               <button onClick={handleLogout} className="btn btn-outline-warning mx-2">Logout</button>
             </>   
            )}

          </Nav>
        </Navbar>

  );
}

export default NavMenu;
