import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import './TaskForm.css';

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

    if (loading && isEditMode && !formData.title) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading task details...</span>
                </div>
                <p className="mt-3">Loading task details...</p>
            </div>
        );
    }

    return (
        <div className="task-form-container fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="task-form-title">{isEditMode ? 'Edit Task' : 'Create New Task'}</h1>
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate(projectId ? `/projects/${projectId}` : '/tasks')}
                    className="d-flex align-items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    {projectId ? 'Back to Project' : 'Back to Tasks'}
                </Button>
            </div>
            
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="task-form-card">
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Project</Form.Label>
                                    <Form.Select
                                        name="projectId"
                                        value={formData.projectId}
                                        onChange={handleChange}
                                        required
                                        disabled={!!projectId || isEditMode}
                                        className="form-control-lg"
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map(project => (
                                            <option key={project.projectId} value={project.projectId}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select a project for this task.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        placeholder="Enter task title"
                                        className="form-control-lg"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a task title.
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
                                        placeholder="Describe the task in detail (optional)"
                                        maxLength={500}
                                    />
                                </Form.Group>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <div className="status-selector">
                                                <div className="status-options">
                                                    <div 
                                                        className={`status-option-box ${formData.status === 'ToDo' ? 'active' : ''} todo`}
                                                        onClick={() => setFormData({...formData, status: 'ToDo'})}
                                                    >
                                                        <div className="status-dot"></div>
                                                        <span>To Do</span>
                                                    </div>
                                                    
                                                    <div 
                                                        className={`status-option-box ${formData.status === 'InProgress' ? 'active' : ''} in-progress`}
                                                        onClick={() => setFormData({...formData, status: 'InProgress'})}
                                                    >
                                                        <div className="status-dot"></div>
                                                        <span>In Progress</span>
                                                    </div>
                                                    
                                                    <div 
                                                        className={`status-option-box ${formData.status === 'Done' ? 'active' : ''} done`}
                                                        onClick={() => setFormData({...formData, status: 'Done'})}
                                                    >
                                                        <div className="status-dot"></div>
                                                        <span>Done</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Assigned To</Form.Label>
                                            <Form.Select
                                                name="assignedTo"
                                                value={formData.assignedTo}
                                                onChange={handleChange}
                                                disabled={!formData.projectId}
                                            >
                                                <option value="">Unassigned</option>
                                                {projectMembers.map(member => (
                                                    <option key={member.userId} value={member.userId}>
                                                        {member.username}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {!formData.projectId && (
                                                <Form.Text className="text-muted">
                                                    Select a project first to see available members
                                                </Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]} // Set min to today
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate(projectId ? `/projects/${projectId}` : '/tasks')}
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
                                            isEditMode ? 'Update Task' : 'Create Task'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    {isEditMode && (
                        <div className="text-center mt-4">
                            <Link to={`/tasks/${id}`} className="text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View Task Details
                            </Link>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default TaskForm;
