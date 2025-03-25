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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <span className="brand-text">Tii Task Manager</span>
                </Navbar.Brand>

                <div className="d-flex align-items-center ml-auto">
                    {user ? (
                        <>
                            <div className="d-flex align-items-center me-4">
                                <div className="position-relative me-3">
                                    <button className="btn p-1 position-relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            3
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <Dropdown align="end">
                                <Dropdown.Toggle as="div" className="user-dropdown">
                                    <div className="user-avatar">
                                        {getUserInitials()}
                                    </div>
                                    <div className="user-info d-none d-lg-flex">
                                        <span className="user-name">{user.username}</span>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
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