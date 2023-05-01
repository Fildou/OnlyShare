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
import {faRightToBracket, faRightFromBracket, faUserPlus, faUser, faAddressCard, faList} from '@fortawesome/free-solid-svg-icons';

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
                  <Link className="btn btn-outline-info" to="/login" style={{ textDecoration: 'none' }}>Login <FontAwesomeIcon icon={faRightToBracket} /></Link>
                  <Link className="mx-2 btn btn-outline-warning" to="/register" style={{ textDecoration: 'none' }}>Register <FontAwesomeIcon icon={faUserPlus} /></Link>
                </>
            )}
            {isLoggedIn && (
             <>
               <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                 <DropdownToggle caret color="outline-info" style={{ textDecoration: 'none' }}>
                   Account <FontAwesomeIcon icon={faUser} />
                 </DropdownToggle>
                 <DropdownMenu>
                   <DropdownItem onClick={handleProfile}>
                     <Link style={{ textDecoration: 'none' }}><FontAwesomeIcon icon={faAddressCard} /> Profile</Link>
                   </DropdownItem>
                   <DropdownItem>
                     <Link to="/UserQuestions" style={{ textDecoration: 'none' }}><FontAwesomeIcon icon={faList} /> My questions</Link>
                   </DropdownItem>
                 </DropdownMenu>
               </Dropdown>
               <button onClick={handleLogout} className="btn btn-outline-warning mx-2">Logout <FontAwesomeIcon icon={faRightFromBracket} /></button>
             </>   
            )}

          </Nav>
        </Navbar>

  );
}

export default NavMenu;
