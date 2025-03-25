import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import './ProjectForm.css';

const ProjectForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchProject();
        }
    }, [id, isEditMode]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const project = await projectService.getById(id);
            setFormData({
                name: project.name,
                description: project.description || ''
            });
        } catch (err) {
            console.error('Error fetching project:', err);
            setError('Failed to load project details. Please try again or go back to projects.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            setLoading(true);
            
            if (isEditMode) {
                await projectService.update({
                    projectId: parseInt(id),
                    ...formData
                });
                
                // Show success message or notification
            } else {
                const newProject = await projectService.create(formData);
                
                // If needed, get the ID of the new project for redirection
                // const newId = newProject.projectId;
            }
            
            navigate('/projects');
        } catch (err) {
            console.error('Error saving project:', err);
            setError(`Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode && !formData.name) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading project details...</span>
                </div>
                <p className="mt-3">Loading project details...</p>
            </div>
        );
    }

    return (
        <div className="project-form-container fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="project-form-title">{isEditMode ? 'Edit Project' : 'Create New Project'}</h1>
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/projects')}
                    className="d-flex align-items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Projects
                </Button>
            </div>
            
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="project-form-card">
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        placeholder="Enter project name"
                                        className="form-control-lg"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a project name.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe your project (optional)"
                                        maxLength={500}
                                    />
                                    <Form.Text className="text-muted">
                                        Provide a clear description of your project's goals and scope. Max 500 characters.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/projects')}
                                        className="me-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isEditMode ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            isEditMode ? 'Update Project' : 'Create Project'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    {isEditMode && (
                        <div className="text-center mt-4">
                            <Link to={`/projects/${id}`} className="text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View Project Details
                            </Link>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ProjectForm;
