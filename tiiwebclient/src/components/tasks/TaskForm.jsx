// components/tasks/TaskForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';

const TaskForm = () => {
    const { id, projectId } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        projectId: projectId || '',
        title: '',
        description: '',
        status: 'ToDo',
        assignedTo: '',
        dueDate: ''
    });
    const [projects, setProjects] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
        if (isEditMode) {
            fetchTask();
        } else if (projectId) {
            fetchProjectMembers(projectId);
        }
    }, [id, projectId, isEditMode]);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getAll();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to load projects.');
        }
    };

    const fetchTask = async () => {
        try {
            setLoading(true);
            const task = await taskService.getById(id);

            // Format the date to YYYY-MM-DD for the date input
            const formattedDueDate = task.dueDate ?
                new Date(task.dueDate).toISOString().split('T')[0] : '';

            setFormData({
                projectId: task.projectId.toString(),
                title: task.title,
                description: task.description || '',
                status: task.status,
                assignedTo: task.assignedTo || '',
                dueDate: formattedDueDate
            });

            await fetchProjectMembers(task.projectId);
        } catch (err) {
            console.error('Error fetching task:', err);
            setError('Failed to load task details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectMembers = async (projectId) => {
        if (!projectId) return;

        try {
            const members = await projectService.getMembers(projectId);
            setProjectMembers(members);
        } catch (err) {
            console.error('Error fetching project members:', err);
            // Don't set error here to avoid overriding more important errors
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If project changes, fetch its members
        if (name === 'projectId' && value) {
            fetchProjectMembers(value);
        }
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

            // Convert projectId to number
            const taskData = {
                ...formData,
                projectId: parseInt(formData.projectId)
            };

            if (isEditMode) {
                await taskService.update({
                    taskId: parseInt(id),
                    ...taskData
                });
            } else {
                await taskService.create(taskData);
            }

            if (projectId) {
                navigate(`/projects/${projectId}`);
            } else {
                navigate('/tasks');
            }
        } catch (err) {
            console.error('Error saving task:', err);
            setError(`Failed to ${isEditMode ? 'update' : 'create'} task. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div className="text-center mt-5">Loading task details...</div>;
    }

    return (
        <Container className="mt-4">
            <h2>{isEditMode ? 'Edit Task' : 'Create New Task'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Project</Form.Label>
                    <Form.Select
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        required
                        disabled={!!projectId || isEditMode}
                    >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.name}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a project.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={100}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please provide a task title.
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

                <Row className="mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="ToDo">To Do</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Done">Done</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Assigned To</Form.Label>
                            <Form.Select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">Unassigned</option>
                                {projectMembers.map(member => (
                                    <option key={member.userId} value={member.userId}>
                                        {member.username}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(projectId ? `/projects/${projectId}` : '/tasks')}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Task'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default TaskForm;