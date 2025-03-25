import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import './Layout.css';

const AppLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="app-wrapper">
            <NavBar toggleSidebar={toggleSidebar} />
            <div className="content-wrapper">
                <Sidebar collapsed={sidebarCollapsed} />
                <main className="main-content">
                    <Container fluid className="py-4 px-4">
                        <Outlet />
                    </Container>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;