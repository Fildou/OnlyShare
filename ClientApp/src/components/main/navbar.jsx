import React, { useState } from "react";
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Link, useNavigate  } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../../middleware/authContext";

function NavMenu() {
    const [collapsed, setCollapsed] = useState(true);
    const { isLoggedIn, toggleLogin  } = useAuth();
    const navigate = useNavigate();

    function toggleNavbar() {
        setCollapsed(!collapsed);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        toggleLogin();
        navigate("/");
    };

    return (
        <header>
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
                <NavbarBrand tag={Link} to="/">
                    OnlyShare
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        {!isLoggedIn && (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/register">
                                        Register
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/login">
                                        Login
                                    </NavLink>
                                </NavItem>
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" onClick={handleLogout}>
                                        Logout
                                    </NavLink>
                                </NavItem>
                            </>
                        )}
                    </ul>
                </Collapse>
            </Navbar>
        </header>
    );
}

export default NavMenu;