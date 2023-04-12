import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  InputGroup,
  InputGroupText,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../../middleware/authContext";


function NavMenu() {
  const [collapsed, setCollapsed] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, toggleLogin } = useAuth();
  const navigate = useNavigate();

  function toggleNavbar() {
    setCollapsed(!collapsed);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    toggleLogin();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header>

      <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>

          <NavbarBrand tag={Link} to="/" className="onlyshare">
              OnlyShare
          </NavbarBrand>
         

        
          <div className="searchbar-wrapper">
            <InputGroup className="searchbar">
                <Input className="search" placeholder="Search" />
                <InputGroupText addonType="append">
                    <button className="searchbtn" type="button">
                    🔍
                    </button>
                </InputGroupText>
                </InputGroup>
            </div>

              
                <Dropdown   isOpen={dropdownOpen} toggle={toggleDropdown}>
                  <DropdownToggle caret>
                   
                    <img src={require("../resources/user.png")} alt="icon" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {!isLoggedIn && (
                      <>
                        <DropdownItem tag={Link} to="/register">
                          Register
                        </DropdownItem>
                        <DropdownItem tag={Link} to="/login">
                          Login
                        </DropdownItem>
                      </>
                    )}
                    {isLoggedIn && (
                      <>
                        <DropdownItem tag={Link} onClick={handleLogout}>
                          Logout
                        </DropdownItem>
                      </>
                    )}
                  </DropdownMenu>
                </Dropdown>
              
           
          
      </Navbar>
    </header>
  );
}

export default NavMenu;
