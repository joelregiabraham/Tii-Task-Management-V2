// components/projects/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import {
    Container, Row, Col, Card, Button, Badge, Alert,
    Table, Tabs, Tab, Dropdown, ProgressBar
} from 'react-bootstrap';
import ProjectMembers from './ProjectMembers';
import { useAuth } from '../../contexts/AuthContext';
import { canManageProjects, canManageTasks, isViewer } from '../../utils/roleUtils';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Permission checks
    const userCanManageProjects = canManageProjects(user);
    const userCanManageTasks = canManageTasks(user);
    const userIsViewer = isViewer(user);

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const projectData = await projectService.getById(id);
            setProject(projectData);

            const tasksData = await taskService.getByProject(id);
            setTasks(tasksData);

            setError('');
        } catch (err) {
            console.error('Error fetching project data:', err);
            setError('Failed to load project details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project? This will also delete all tasks within this project.')) {
            try {
                await projectService.delete(id);
                navigate('/projects');
            } catch (err) {
                console.error('Error deleting project:', err);
                setError('Failed to delete project. Please try again.');
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(taskId);
                setTasks(tasks.filter(task => task.taskId !== taskId));
            } catch (err) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task. Please try again.');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ToDo': return <Badge bg="secondary">To Do</Badge>;
            case 'InProgress': return <Badge bg="primary">In Progress</Badge>;
            case 'Done': return <Badge bg="success">Done</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const calculateTaskStats = () => {
        const total = tasks.length;
        const todoCount = tasks.filter(t => t.status === 'ToDo').length;
        const inProgressCount = tasks.filter(t => t.status === 'InProgress').length;
        const doneCount = tasks.filter(t => t.status === 'Done').length;

        const todoPercent = total > 0 ? Math.round((todoCount / total) * 100) : 0;
        const inProgressPercent = total > 0 ? Math.round((inProgressCount / total) * 100) : 0;
        const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

        return {
            total,
            todoCount,
            inProgressCount,
            doneCount,
            todoPercent,
            inProgressPercent,
            donePercent
        };
    };

    const stats = calculateTaskStats();

    if (loading) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading project details...</span>
                </div>
                <p className="mt-3">Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="mt-4">
                <Alert variant="danger">
                    Project not found. <Link to="/projects">Return to projects</Link>
                </Alert>
            </div>
        );
    }

    return (
        <div className="project-detail-container fade-in">
            <div className="project-header mb-4">
                <div className="d-flex align-items-center">
                    <div className="project-icon-large me-3">
                        {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="project-title mb-1">{project.name}</h1>
                        <div className="project-metadata">
                            <span className="me-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Created: {new Date(project.creationDate).toLocaleDateString()}
                            </span>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                Last updated: {new Date(project.lastModifiedDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="project-actions">
                    {userCanManageTasks && (
                        <Link to={`/projects/${id}/tasks/create`}>
                            <Button variant="primary" className="me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Add Task
                            </Button>
                        </Link>
                    )}
                    {userCanManageProjects && (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="project-actions-dropdown">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="1"></circle>
                                    <circle cx="12" cy="5" r="1"></circle>
                                    <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu align="end">
                                <Dropdown.Item as={Link} to={`/projects/edit/${id}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                    Edit Project
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="text-danger" onClick={handleDeleteProject}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Delete Project
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="project-tabs"
                className="mb-4 project-tabs"
            >
                <Tab eventKey="overview" title="Overview">
                    <Row className="g-4">
                        <Col lg={8}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <h5 className="card-title mb-3">Description</h5>
                                    <p className="project-description">
                                        {project.description || 'No description provided for this project.'}
                                    </p>
                                </Card.Body>
                            </Card>

                            <Card className="mb-4">
                                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Task Progress</h5>
                                    <Badge bg="primary" className="task-count-badge">
                                        {stats.total} Tasks
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    {stats.total === 0 ? (
                                        <div className="text-center py-4">
                                            <p className="text-muted mb-3">No tasks have been created for this project yet.</p>
                                            {userCanManageTasks && (
                                                <Link to={`/projects/${id}/tasks/create`}>
                                                    <Button variant="outline-primary">Create First Task</Button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="progress-stacked mb-4">
                                                <ProgressBar
                                                    className="progress-segment-done"
                                                    now={stats.donePercent}
                                                    key={1}
                                                />
                                                <ProgressBar
                                                    className="progress-segment-progress"
                                                    now={stats.inProgressPercent}
                                                    key={2}
                                                />
                                                <ProgressBar
                                                    className="progress-segment-todo"
                                                    now={stats.todoPercent}
                                                    key={3}
                                                />
                                            </div>

                                            <div className="task-stats">
                                                <div className="task-stat-item">
                                                    <div className="task-stat-label">
                                                        <span className="status-dot status-todo"></span>
                                                        To Do
                                                    </div>
                                                    <div className="task-stat-value">
                                                        {stats.todoCount} tasks
                                                    </div>
                                                </div>

                                                <div className="task-stat-item">
                                                    <div className="task-stat-label">
                                                        <span className="status-dot status-progress"></span>
                                                        In Progress
                                                    </div>
                                                    <div className="task-stat-value">
                                                        {stats.inProgressCount} tasks
                                                    </div>
                                                </div>

                                                <div className="task-stat-item">
                                                    <div className="task-stat-label">
                                                        <span className="status-dot status-done"></span>
                                                        Completed
                                                    </div>
                                                    <div className="task-stat-value">
                                                        {stats.doneCount} tasks
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="mb-4">
                                <Card.Header className="bg-white">
                                    <h5 className="mb-0">Project Members</h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <ProjectMembers projectId={id} onMemberUpdate={fetchProjectData} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="tasks" title="Tasks">
                    <Card>
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Task List</h5>
                            {userCanManageTasks && (
                                <Link to={`/projects/${id}/tasks/create`}>
                                    <Button variant="primary" size="sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add Task
                                    </Button>
                                </Link>
                            )}
                        </Card.Header>
                        <Card.Body className="p-0">
                            {tasks.length === 0 ? (
                                <div className="text-center py-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-3">
                                        <path d="M9 11l3 3L22 4"></path>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                    <p className="text-muted mb-3">No tasks have been created for this project yet.</p>
                                    {userCanManageTasks && (
                                        <Link to={`/projects/${id}/tasks/create`}>
                                            <Button variant="outline-primary">Create First Task</Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="project-tasks-table mb-0">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40%' }}>Task</th>
                                                <th>Status</th>
                                                <th>Assigned To</th>
                                                <th>Due Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasks.map(task => (
                                                <tr key={task.taskId} className={`task-row status-${task.status.toLowerCase()}`}>
                                                    <td>
                                                        <Link to={`/tasks/${task.taskId}`} className="task-link">
                                                            {task.title}
                                                        </Link>
                                                    </td>
                                                    <td>{getStatusBadge(task.status)}</td>
                                                    <td>
                                                        <div className="assignee">
                                                            <div className="assignee-avatar">
                                                                {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            <span>{task.assignedToName || 'Unassigned'}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                                    </td>
                                                    <td>
                                                        <div className="task-actions">
                                                            <Link to={`/tasks/${task.taskId}`} className="btn btn-sm btn-outline-info me-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                </svg>
                                                            </Link>
                                                            {userCanManageTasks && (
                                                                <>
                                                                    <Link to={`/tasks/edit/${task.taskId}`} className="btn btn-sm btn-outline-secondary me-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                        </svg>
                                                                    </Link>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteTask(task.taskId)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                        </svg>
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                {userCanManageProjects && (
                    <Tab eventKey="settings" title="Settings">
                        <Card>
                            <Card.Body>
                                <h5 className="card-title mb-4">Project Settings</h5>

                                <div className="settings-section mb-4">
                                    <h6>General Settings</h6>
                                    <div className="settings-actions mt-3">
                                        <Link to={`/projects/edit/${id}`} className="btn btn-outline-primary">
                                            Edit Project Details
                                        </Link>
                                    </div>
                                </div>

                                <div className="settings-section mb-4">
                                    <h6>Danger Zone</h6>
                                    <div className="danger-zone p-3 mt-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">Delete this project</h6>
                                                <p className="text-muted mb-0">Once you delete a project, there is no going back. This action cannot be undone.</p>
                                            </div>
                                            <Button variant="danger" onClick={handleDeleteProject}>
                                                Delete Project
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Tab>
                )}
            </Tabs>
        </div>
    );
};

export default ProjectDetail;