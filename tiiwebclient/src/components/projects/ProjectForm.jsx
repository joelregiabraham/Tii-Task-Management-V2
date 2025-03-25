// components/projects/ProjectForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Form, Button, Container, Alert } from 'react-bootstrap';

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
                description: project.description
            });
        } catch (err) {
            console.error('Error fetching project:', err);
            setError('Failed to load project details.');
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
            } else {
                await projectService.create(formData);
            }

            navigate('/projects');
        } catch (err) {
            console.error('Error saving project:', err);
            setError(`Failed to ${isEditMode ? 'update' : 'create'} project. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div className="text-center mt-5">Loading project details...</div>;
    }

    return (
        <Container className="mt-4">
            <h2>{isEditMode ? 'Edit Project' : 'Create New Project'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a project name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={500}
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={() => navigate('/projects')}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Project'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default ProjectForm;