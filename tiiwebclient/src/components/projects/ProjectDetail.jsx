// components/projects/ProjectDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import ProjectMembers from './ProjectMembers';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) {
        return <div className="text-center mt-5">Loading project details...</div>;
    }

    if (!project) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    Project not found. <Link to="/projects">Return to projects</Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{project.name}</h2>
                <div>
                    <Link to={`/projects/edit/${id}`}>
                        <Button variant="outline-primary" className="me-2">Edit Project</Button>
                    </Link>
                    <Button variant="outline-danger" onClick={handleDeleteProject}>Delete Project</Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card className="mb-4">
                <Card.Body>
                    <Card.Text>{project.description || 'No description provided'}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Badge bg="info" className="me-2">Created: {new Date(project.creationDate).toLocaleDateString()}</Badge>
                            <Badge bg="secondary">Modified: {new Date(project.lastModifiedDate).toLocaleDateString()}</Badge>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Row>
                <Col md={8}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4>Tasks</h4>
                        <Link to={`/projects/${id}/tasks/create`}>
                            <Button variant="primary" size="sm">Create New Task</Button>
                        </Link>
                    </div>

                    {tasks.length === 0 ? (
                        <Alert variant="info">
                            No tasks found for this project. <Link to={`/projects/${id}/tasks/create`}>Create your first task</Link>
                        </Alert>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
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
                                            <Badge bg={
                                                task.status === 'ToDo' ? 'secondary' :
                                                    task.status === 'InProgress' ? 'primary' : 'success'
                                            }>
                                                {task.status}
                                            </Badge>
                                        </td>
                                        <td>{task.assignedToName || 'Unassigned'}</td>
                                        <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
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
                                                onClick={() => handleDeleteTask(task.taskId)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>

                <Col md={4}>
                    <h4 className="mb-3">Project Members</h4>
                    <ProjectMembers projectId={id} onMemberUpdate={fetchProjectData} />
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectDetail;