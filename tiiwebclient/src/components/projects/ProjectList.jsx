// components/projects/ProjectList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Button, Card, Container, Row, Col, Badge, Alert } from 'react-bootstrap';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleDelete = async (id) => {
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

    if (loading) {
        return <div className="text-center mt-5">Loading projects...</div>;
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Projects</h2>
                <Link to="/projects/create">
                    <Button variant="primary">Create New Project</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {projects.length === 0 ? (
                <div className="text-center">
                    <p>You don't have any projects yet.</p>
                    <Link to="/projects/create">
                        <Button variant="outline-primary">Create your first project</Button>
                    </Link>
                </div>
            ) : (
                <Row>
                    {projects.map(project => (
                        <Col md={4} className="mb-4" key={project.projectId}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{project.name}</Card.Title>
                                    <Card.Text>
                                        {project.description || 'No description provided'}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Badge bg="info">
                                            {new Date(project.creationDate).toLocaleDateString()}
                                        </Badge>
                                        <div>
                                            <Link to={`/projects/${project.projectId}`}>
                                                <Button variant="outline-primary" size="sm" className="me-2">
                                                    View
                                                </Button>
                                            </Link>
                                            <Link to={`/projects/edit/${project.projectId}`}>
                                                <Button variant="outline-secondary" size="sm" className="me-2">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(project.projectId)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ProjectList;