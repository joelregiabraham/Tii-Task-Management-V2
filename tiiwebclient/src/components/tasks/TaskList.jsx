// components/tasks/TaskList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleDelete = async (id) => {
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
            case 'ToDo': return <Badge bg="secondary">To Do</Badge>;
            case 'InProgress': return <Badge bg="primary">In Progress</Badge>;
            case 'Done': return <Badge bg="success">Done</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading tasks...</div>;
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Tasks</h2>
                <Link to="/tasks/create">
                    <Button variant="primary">Create New Task</Button>
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {tasks.length === 0 ? (
                <div className="text-center">
                    <p>You don't have any tasks yet.</p>
                    <Link to="/tasks/create">
                        <Button variant="outline-primary">Create your first task</Button>
                    </Link>
                </div>
            ) : (
                <Table striped bordered hover responsive>
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
                        {tasks.map(task => (
                            <tr key={task.taskId}>
                                <td>{task.title}</td>
                                <td>
                                    <Link to={`/projects/${task.projectId}`}>
                                        Project #{task.projectId}
                                    </Link>
                                </td>
                                <td>{getStatusBadge(task.status)}</td>
                                <td>{task.assignedToName || 'Unassigned'}</td>
                                <td>
                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                </td>
                                <td>
                                    <Link to={`/tasks/${task.taskId}`}>
                                        <Button variant="outline-info" size="sm" className="me-1">View</Button>
                                    </Link>
                                    <Link to={`/tasks/edit/${task.taskId}`}>
                                        <Button variant="outline-secondary" size="sm" className="me-1">Edit</Button>
                                    </Link>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(task.taskId)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default TaskList;