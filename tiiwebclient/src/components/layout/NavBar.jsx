// ClientApp/src/components/layout/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const NavBar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getUserInitials = () => {
        if (!user || !user.username) return '?';

        return user.username.substring(0, 2).toUpperCase();
    };

    return (
        <Navbar bg="white" expand="lg" className="navbar-custom">
            <Container fluid className="px-4">
                <button
                    className="sidebar-toggle me-3 d-md-none"
                    onClick={toggleSidebar}
                >
                    <img src="/tii-logo.png" alt="Tii Logo" className="navbar-brand-logo" />

                </button>

                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <img src="/tii-logo.png" alt="Tii Logo" className="navbar-brand-logo" />

                    <span className="brand-text">Tii Task Manager</span>
                </Navbar.Brand>

                <div className="d-flex align-items-center ml-auto">
                    {user ? (
                        <Dropdown align="end">
                            <Dropdown.Toggle as="div" className="user-dropdown">
                                <img src="/userProfile.png" alt="User Profile" className="user-avatar-img" />
                                <div className="user-info d-none d-lg-flex">
                                    <span className="user-name">{user.username}</span>
                                </div>
                            </Dropdown.Toggle>


                            <Dropdown.Menu>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Nav>
                            <Nav.Link as={Link} to="/login" className="btn btn-outline-primary me-2">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register" className="btn btn-primary">Register</Nav.Link>
                        </Nav>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default NavBar;