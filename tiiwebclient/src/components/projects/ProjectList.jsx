import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Row, Col, Card, Button, Badge, Alert, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import './Projects.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAll();
            setProjects(data);
            setError('');
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.delete(id);
                setProjects(projects.filter(project => project.projectId !== id));
            } catch (err) {
                console.error('Error deleting project:', err);
                setError('Failed to delete project. Please try again.');
            }
        }
    };

    const sortProjects = (projectsToSort) => {
        switch (sortBy) {
            case 'newest':
                return [...projectsToSort].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
            case 'oldest':
                return [...projectsToSort].sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
            case 'name-asc':
                return [...projectsToSort].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...projectsToSort].sort((a, b) => b.name.localeCompare(a.name));
            case 'recently-updated':
                return [...projectsToSort].sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate));
            default:
                return projectsToSort;
        }
    };

    const filterProjects = () => {
        if (!searchTerm) return projects;
        
        return projects.filter(project => 
            project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const filteredProjects = sortProjects(filterProjects());

    if (loading) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading projects...</span>
                </div>
                <p className="mt-3">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="projects-container fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1 className="projects-title mb-0">Projects</h1>
                <Link to="/projects/create">
                    <Button variant="primary" className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create New Project
                    </Button>
                </Link>
            </div>

            <div className="projects-toolbar mb-4">
                <InputGroup className="search-box">
                    <InputGroup.Text id="search-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
                
                <Dropdown className="sort-dropdown">
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-sort">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <path d="M11 5h10"></path>
                            <path d="M11 9h7"></path>
                            <path d="M11 13h4"></path>
                            <path d="M3 17l3 3 3-3"></path>
                            <path d="M6 5v15"></path>
                        </svg>
                        Sort by
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item active={sortBy === 'newest'} onClick={() => setSortBy('newest')}>
                            Newest first
                        </Dropdown.Item>
                        <Dropdown.Item active={sortBy === 'oldest'} onClick={() => setSortBy('oldest')}>
                            Oldest first
                        </Dropdown.Item>
                        <Dropdown.Item active={sortBy === 'name-asc'} onClick={() => setSortBy('name-asc')}>
                            Name (A-Z)
                        </Dropdown.Item>
                        <Dropdown.Item active={sortBy === 'name-desc'} onClick={() => setSortBy('name-desc')}>
                            Name (Z-A)
                        </Dropdown.Item>
                        <Dropdown.Item active={sortBy === 'recently-updated'} onClick={() => setSortBy('recently-updated')}>
                            Recently updated
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {filteredProjects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                    <h3>No projects found</h3>
                    {searchTerm ? (
                        <p>Try adjusting your search term or create a new project.</p>
                    ) : (
                        <p>You don't have any projects yet. Get started by creating your first project.</p>
                    )}
                    <Link to="/projects/create">
                        <Button variant="primary">Create New Project</Button>
                    </Link>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredProjects.map(project => (
                        <Col lg={4} md={6} key={project.projectId}>
                            <Link to={`/projects/${project.projectId}`} className="text-decoration-none">
                                <Card className="project-card h-100">
                                    <Card.Body>
                                        <div className="project-header">
                                            <div className="project-icon">
                                                {project.name.charAt(0).toUpperCase()}
                                            </div>
                                            <Dropdown className="project-actions">
                                                <Dropdown.Toggle variant="light" id={`dropdown-${project.projectId}`} 
                                                    onClick={(e) => e.stopPropagation()}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="12" cy="5" r="1"></circle>
                                                        <circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu onClick={(e) => e.stopPropagation()}>
                                                    <Dropdown.Item as={Link} to={`/projects/edit/${project.projectId}`}>Edit</Dropdown.Item>
                                                    <Dropdown.Item onClick={(e) => handleDelete(project.projectId, e)} className="text-danger">
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        
                                        <Card.Title className="project-title mt-3">{project.name}</Card.Title>
                                        <Card.Text className="project-description">
                                            {project.description || 'No description provided'}
                                        </Card.Text>
                                        
                                        <div className="project-meta">
                                            <Badge bg="light" text="dark" className="project-date">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {new Date(project.creationDate).toLocaleDateString()}
                                            </Badge>
                                            
                                            <div className="tasks-count">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                    <path d="M9 11l3 3L22 4"></path>
                                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                                </svg>
                                                {Math.floor(Math.random() * 20)} tasks {/* This would be replaced with actual task count */}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ProjectList;
