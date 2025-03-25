// components/tasks/TaskDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { Container, Card, Button, Badge, Alert, Form, Row, Col } from 'react-bootstrap';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');
    const [assigneeUpdate, setAssigneeUpdate] = useState('');

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setLoading(true);
            const taskData = await taskService.getById(id);
            setTask(taskData);
            setStatusUpdate(taskData.status);
            setAssigneeUpdate(taskData.assignedTo || '');

            // Fetch project members for the assignment dropdown
            const members = await projectService.getMembers(taskData.projectId);
            setProjectMembers(members);

            setError('');
        } catch (err) {
            console.error('Error fetching task:', err);
            setError('Failed to load task details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.delete(id);
                navigate('/tasks');
            } catch (err) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task. Please try again.');
            }
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatusUpdate(newStatus);

        try {
            await taskService.updateStatus(id, newStatus);
            setTask(prev => ({ ...prev, status: newStatus }));
            setError('');
        } catch (err) {
            console.error('Error updating task status:', err);
            setError('Failed to update task status.');
        }
    };

    const handleAssigneeChange = async (e) => {
        const userId = e.target.value;
        setAssigneeUpdate(userId);

        try {
            if (userId) {
                await taskService.assign(id, userId);

                // Find the member name for display
                const member = projectMembers.find(m => m.userId === userId);
                const memberName = member ? member.username : 'Unknown User';

                setTask(prev => ({
                    ...prev,
                    assignedTo: userId,
                    assignedToName: memberName
                }));
            } else {
                // TODO: Implement unassign functionality in the API
                setError('Unassigning is not supported yet.');
            }
        } catch (err) {
            console.error('Error assigning task:', err);
            setError('Failed to assign task.');
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'ToDo': return 'secondary';
            case 'InProgress': return 'primary';
            case 'Done': return 'success';
            default: return 'secondary';
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading task details...</div>;
    }

    if (!task) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    Task not found. <Link to="/tasks">Return to tasks</Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{task.title}</h2>
                <div>
                    <Link to={`/tasks/edit/${id}`}>
                        <Button variant="outline-primary" className="me-2">Edit Task</Button>
                    </Link>
                    <Button variant="outline-danger" onClick={handleDeleteTask}>Delete Task</Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <h5>Description</h5>
                            <p>{task.description || 'No description provided'}</p>

                            <h5 className="mt-4">Details</h5>
                            <div className="d-flex flex-column gap-2">
                                <div>
                                    <strong>Project: </strong>
                                    <Link to={`/projects/${task.projectId}`}>
                                        Project #{task.projectId}
                                    </Link>
                                </div>
                                <div>
                                    <strong>Created By: </strong>
                                    {task.createdByName || task.createdBy}
                                </div>
                                <div>
                                    <strong>Created On: </strong>
                                    {new Date(task.creationDate).toLocaleString()}
                                </div>
                                <div>
                                    <strong>Last Modified: </strong>
                                    {new Date(task.lastModifiedDate).toLocaleString()}
                                </div>
                                <div>
                                    <strong>Due Date: </strong>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                </div>
                            </div>
                        </Col>

                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <h5>Status</h5>
                                    <div className="mb-3">
                                        <Badge bg={getStatusBadgeColor(task.status)} className="px-3 py-2 fs-6">
                                            {task.status}
                                        </Badge>
                                    </div>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Update Status</Form.Label>
                                        <Form.Select
                                            value={statusUpdate}
                                            onChange={handleStatusChange}
                                        >
                                            <option value="ToDo">To Do</option>
                                            <option value="InProgress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <h5>Assignment</h5>
                                    <div className="mb-3">
                                        {task.assignedToName || 'Unassigned'}
                                    </div>

                                    <Form.Group>
                                        <Form.Label>Assign To</Form.Label>
                                        <Form.Select
                                            value={assigneeUpdate}
                                            onChange={handleAssigneeChange}
                                        >
                                            <option value="">Unassigned</option>
                                            {projectMembers.map(member => (
                                                <option key={member.userId} value={member.userId}>
                                                    {member.username}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TaskDetail;