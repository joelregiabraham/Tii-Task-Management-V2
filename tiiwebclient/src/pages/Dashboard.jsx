import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    tasksCompleted: 0,
    tasksInProgress: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
        
        // Fetch tasks
        const tasksData = await taskService.getAll();
        setTasks(tasksData);
        
        // Calculate stats
        const completedTasks = tasksData.filter(t => t.status === 'Done').length;
        const inProgressTasks = tasksData.filter(t => t.status === 'InProgress').length;
        
        setStats({
          totalProjects: projectsData.length,
          totalTasks: tasksData.length,
          tasksCompleted: completedTasks,
          tasksInProgress: inProgressTasks,
          completionRate: tasksData.length > 0 
            ? Math.round((completedTasks / tasksData.length) * 100) 
            : 0
        });
        
        setError('');
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ToDo': return <Badge bg="secondary">To Do</Badge>;
      case 'InProgress': return <Badge bg="primary">In Progress</Badge>;
      case 'Done': return <Badge bg="success">Done</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get recent tasks
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard fade-in">
      <h1 className="dashboard-title mb-4">Dashboard</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col xl={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-card-icon bg-primary-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="stat-card-title">{stats.totalProjects}</h3>
              <p className="stat-card-text">Total Projects</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-card-icon bg-success-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <h3 className="stat-card-title">{stats.totalTasks}</h3>
              <p className="stat-card-text">Total Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-card-icon bg-warning-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="stat-card-title">{stats.tasksInProgress}</h3>
              <p className="stat-card-text">Tasks in Progress</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xl={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-card-icon bg-info-light">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
              </div>
              <h3 className="stat-card-title">{stats.completionRate}%</h3>
              <p className="stat-card-text">Completion Rate</p>
              <ProgressBar now={stats.completionRate} className="mt-2" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Activity and Tasks */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Projects</h5>
                <Link to="/projects" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
            </Card.Header>
            <Card.Body>
              {projects.length === 0 ? (
                <p className="text-muted">No projects available.</p>
              ) : (
                <div className="project-list">
                  {projects.slice(0, 4).map(project => (
                    <Link to={`/projects/${project.projectId}`} key={project.projectId} className="project-item">
                      <div className="project-icon">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="project-details">
                        <h6 className="project-name">{project.name}</h6>
                        <p className="project-description">{project.description || 'No description'}</p>
                      </div>
                      <div className="project-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Tasks</h5>
                <Link to="/tasks" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {recentTasks.length === 0 ? (
                <p className="text-muted p-3">No tasks available.</p>
              ) : (
                <Table responsive className="table-borderless table-hover task-table mb-0">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map(task => (
                      <tr key={task.taskId}>
                        <td>
                          <Link to={`/tasks/${task.taskId}`} className="task-link">
                            {task.title}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/projects/${task.projectId}`} className="project-link">
                            Project #{task.projectId}
                          </Link>
                        </td>
                        <td>{getStatusBadge(task.status)}</td>
                        <td>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
