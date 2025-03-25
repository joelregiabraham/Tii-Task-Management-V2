import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { Container, Table, Button, Badge, Alert, Row, Col, Card, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import './Tasks.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('table');  // 'table' or 'cards'

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAll();
            setTasks(data);
            setError('');
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(id);
                setTasks(tasks.filter(task => task.taskId !== id));
            } catch (err) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task. Please try again.');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ToDo': 
                return <Badge bg="secondary" className="status-badge">To Do</Badge>;
            case 'InProgress': 
                return <Badge bg="primary" className="status-badge">In Progress</Badge>;
            case 'Done': 
                return <Badge bg="success" className="status-badge">Done</Badge>;
            default: 
                return <Badge bg="secondary" className="status-badge">{status}</Badge>;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ToDo': 
                return (
                    <div className="status-icon status-todo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                );
            case 'InProgress': 
                return (
                    <div className="status-icon status-in-progress">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12A10 10 0 1 1 12 2"></path>
                            <path d="M22 2L12 12"></path>
                        </svg>
                    </div>
                );
            case 'Done': 
                return (
                    <div className="status-icon status-done">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                );
            default: 
                return (
                    <div className="status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                );
        }
    };

    const filterTasks = () => {
        let filtered = tasks;
        
        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(task => task.status === filterStatus);
        }
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        return filtered;
    };

    const filteredTasks = filterTasks();

    if (loading) {
        return (
            <div className="text-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading tasks...</span>
                </div>
                <p className="mt-3">Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="tasks-container fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1 className="tasks-title mb-0">Tasks</h1>
                <Link to="/tasks/create">
                    <Button variant="primary" className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create New Task
                    </Button>
                </Link>
            </div>

            <div className="tasks-toolbar mb-4">
                <InputGroup className="search-box">
                    <InputGroup.Text id="search-addon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </InputGroup.Text>
                    <FormControl
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>

                <div className="status-filter">
                    <Button 
                        variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('all')}
                        className="me-2"
                    >
                        All
                    </Button>
                    <Button 
                        variant={filterStatus === 'ToDo' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('ToDo')}
                        className="me-2"
                    >
                        To Do
                    </Button>
                    <Button 
                        variant={filterStatus === 'InProgress' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('InProgress')}
                        className="me-2"
                    >
                        In Progress
                    </Button>
                    <Button 
                        variant={filterStatus === 'Done' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('Done')}
                    >
                        Done
                    </Button>
                </div>

                <div className="view-toggle">
                    <Button 
                        variant={viewMode === 'table' ? 'primary' : 'outline-secondary'}
                        onClick={() => setViewMode('table')}
                        className="me-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </Button>
                    <Button 
                        variant={viewMode === 'cards' ? 'primary' : 'outline-secondary'}
                        onClick={() => setViewMode('cards')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </div>
                    <h3>No tasks found</h3>
                    {searchTerm || filterStatus !== 'all' ? (
                        <p>Try adjusting your filters or search term.</p>
                    ) : (
                        <p>You don't have any tasks yet. Get started by creating your first task.</p>
                    )}
                    <Link to="/tasks/create">
                        <Button variant="primary">Create New Task</Button>
                    </Link>
                </div>
            ) : viewMode === 'table' ? (
                <div className="table-responsive">
                    <Table hover className="tasks-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Due Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.taskId} className={`task-row status-${task.status.toLowerCase()}`}>
                                    <td>
                                        <Link to={`/tasks/${task.taskId}`} className="task-title-link">
                                            <div className="d-flex align-items-center">
                                                {getStatusIcon(task.status)}
                                                <span>{task.title}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/projects/${task.projectId}`} className="project-link">
                                            Project #{task.projectId}
                                        </Link>
                                    </td>
                                    <td>{getStatusBadge(task.status)}</td>
                                    <td>
                                        <div className="assignee">
                                            {task.assignedToName || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td>
                                        {task.dueDate ? (
                                            <div className="due-date">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <span className="text-muted">No due date</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="task-actions">
                                            <Link to={`/tasks/${task.taskId}`} className="btn btn-sm btn-outline-info me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </svg>
                                            </Link>
                                            <Link to={`/tasks/edit/${task.taskId}`} className="btn btn-sm btn-outline-secondary me-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                </svg>
                                            </Link>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={(e) => handleDelete(task.taskId, e)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <Row className="g-4">
                    {filteredTasks.map(task => (
                        <Col lg={4} md={6} key={task.taskId}>
                            <Card className={`task-card h-100 status-border-${task.status.toLowerCase()}`}>
                                <Card.Body>
                                    <div className="task-card-header">
                                        {getStatusBadge(task.status)}
                                        <Dropdown className="task-actions">
                                            <Dropdown.Toggle variant="light" id={`dropdown-${task.taskId}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="1"></circle>
                                                    <circle cx="12" cy="5" r="1"></circle>
                                                    <circle cx="12" cy="19" r="1"></circle>
                                                </svg>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item as={Link} to={`/tasks/${task.taskId}`}>View</Dropdown.Item>
                                                <Dropdown.Item as={Link} to={`/tasks/edit/${task.taskId}`}>Edit</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item onClick={() => handleDelete(task.taskId)} className="text-danger">
                                                    Delete
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    
                                    <Link to={`/tasks/${task.taskId}`} className="text-decoration-none">
                                        <Card.Title className="task-card-title mt-3">{task.title}</Card.Title>
                                    </Link>
                                    
                                    <Card.Text className="task-card-description">
                                        {task.description || 'No description provided'}
                                    </Card.Text>
                                    
                                    <div className="task-card-project">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                        <Link to={`/projects/${task.projectId}`} className="project-link">
                                            Project #{task.projectId}
                                        </Link>
                                    </div>
                                    
                                    <div className="task-card-meta">
                                        <div className="assignee">
                                            <div className="assignee-avatar">
                                                {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span>{task.assignedToName || 'Unassigned'}</span>
                                        </div>
                                        
                                        {task.dueDate && (
                                            <div className="due-date">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                                </svg>
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default TaskList;
