// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import NavBar from './components/layout/NavBar';
import PrivateRoute from './components/layout/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Project Components
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetail from './components/projects/ProjectDetail';

// Task Components
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskDetail from './components/tasks/TaskDetail';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Container className="py-4">
                    <Routes>
                        {/* Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Project Routes */}
                        <Route
                            path="/projects"
                            element={
                                <PrivateRoute>
                                    <ProjectList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/create"
                            element={
                                <PrivateRoute>
                                    <ProjectForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/edit/:id"
                            element={
                                <PrivateRoute>
                                    <ProjectForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/:id"
                            element={
                                <PrivateRoute>
                                    <ProjectDetail />
                                </PrivateRoute>
                            }
                        />

                        {/* Task Routes */}
                        <Route
                            path="/tasks"
                            element={
                                <PrivateRoute>
                                    <TaskList />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/tasks/create"
                            element={
                                <PrivateRoute>
                                    <TaskForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/:projectId/tasks/create"
                            element={
                                <PrivateRoute>
                                    <TaskForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/tasks/edit/:id"
                            element={
                                <PrivateRoute>
                                    <TaskForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/tasks/:id"
                            element={
                                <PrivateRoute>
                                    <TaskDetail />
                                </PrivateRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/projects" />} />
                    </Routes>
                </Container>
            </Router>
        </AuthProvider>
    );
}

export default App;