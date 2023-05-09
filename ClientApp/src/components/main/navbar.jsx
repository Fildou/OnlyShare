import React, { useState } from "react";
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faRightToBracket, faRightFromBracket, faUserPlus, faUser, faAddressCard, faList} from '@fortawesome/free-solid-svg-icons';

function NavMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let username = "";
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
  
  const token =localStorage.getItem("token");
  if (token){
    const decoded = jwt_decode(token);
    username = decoded.unique_name;
  }
  
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
          <NavbarBrand className="navbar-things" tag={Link} style={{ textDecoration: 'none' }} to="/">
            <i><img src={OnlyShareLogo} alt="logo" className="logo"/></i>
            <span className="mx-2 logo-text">Onlyshare </span>
            <Link className="logo-text" to="/questions">Posts</Link>
          </NavbarBrand>

          <Dropdown className="hamburger" isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle color="outline-info" style={{ textDecoration: 'none' }}>
              <FontAwesomeIcon icon={faBars} />
            </DropdownToggle>
            <DropdownMenu className="hamburger-menu">
              <DropdownItem onClick={handleProfile}>
                { !isLoggedIn &&(
                    <>
                      <Link className="btn btn-outline-info" to="/login" style={{ textDecoration: 'none' }}>Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
                    </>
                )}
                {isLoggedIn && (
                    <>
                      <Link className="btn btn-outline-info" onClick={handleProfile} style={{ textDecoration: 'none' }}>{username} <FontAwesomeIcon icon={faUser} /></Link>
                    </>
                )}
              </DropdownItem>
              <DropdownItem>
                { !isLoggedIn &&(
                    <>
                      <Link className=" btn btn-outline-warning" to="/register" style={{ textDecoration: 'none' }}>Register <FontAwesomeIcon icon={faUserPlus} /></Link>
                    </>
                )}
                {isLoggedIn && (
                    <>
                      <Link className=" btn btn-outline-warning" onClick={handleLogout} to="/login">Logout <FontAwesomeIcon icon={faRightFromBracket} /></Link>
                    </>
                )}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Nav className="button-group">
            { !isLoggedIn &&(
                <>
                  <Link className="btn btn-outline-info" to="/login" style={{ textDecoration: 'none' }}>Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
                  <Link className="mx-2 btn btn-outline-warning" to="/register" style={{ textDecoration: 'none' }}>Register <FontAwesomeIcon icon={faUserPlus} /></Link>
                </>
            )}
            {isLoggedIn && (
             <>
               <button onClick={handleProfile} className="btn btn-outline-info" style={{ textDecoration: 'none' }}>{username} <FontAwesomeIcon icon={faUser} /></button>
               <button onClick={handleLogout} className="btn btn-outline-warning mx-2">Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
             </>   
            )}
          </Nav>
        </Navbar>

  );
}

export default NavMenu;
