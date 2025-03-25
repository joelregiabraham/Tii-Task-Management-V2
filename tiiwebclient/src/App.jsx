import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/layout/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Pages
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';

// Project Components
import ProjectList from './components/projects/ProjectList';
import ProjectForm from './components/projects/ProjectForm';
import ProjectDetail from './components/projects/ProjectDetail';

// Task Components
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskDetail from './components/tasks/TaskDetail';

// Import Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth Routes - Public */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* All protected routes with AppLayout */}
                    <Route element={
                        <PrivateRoute>
                            <AppLayout />
                        </PrivateRoute>
                    }>
                        {/* Dashboard */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Project Routes */}
                        <Route path="/projects" element={<ProjectList />} />
                        <Route path="/projects/create" element={<ProjectForm />} />
                        <Route path="/projects/edit/:id" element={<ProjectForm />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />

                        {/* Task Routes */}
                        <Route path="/tasks" element={<TaskList />} />
                        <Route path="/tasks/create" element={<TaskForm />} />
                        <Route path="/projects/:projectId/tasks/create" element={<TaskForm />} />
                        <Route path="/tasks/edit/:id" element={<TaskForm />} />
                        <Route path="/tasks/:id" element={<TaskDetail />} />

                        {/* Calendar View */}
                        <Route path="/calendar" element={<CalendarView />} />

                        {/* Team View (placeholder for future implementation) */}
                        <Route path="/team" element={<Dashboard />} />

                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Route>

                    {/* Catch all - redirect to login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;