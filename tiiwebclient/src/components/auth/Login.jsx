import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            setError('');
            setLoading(true);
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-brand text-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-icon text-primary">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    <h1 className="brand-text mt-3">Tii Task Manager</h1>
                    <p className="text-muted">Sign in to your account</p>
                </div>
                
                <Card className="auth-card">
                    <Card.Body className="p-4">
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    className="form-control-lg"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide your username.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <Form.Label>Password</Form.Label>
                                    <Link to="/forgot-password" className="text-sm forgot-password">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-control-lg"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide your password.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Check
                                    type="checkbox"
                                    name="rememberMe"
                                    label="Remember me"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <div className="d-grid mb-3">
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </div>
                        </Form>
                        
                        <div className="text-center mt-4">
                            <p className="mb-0">
                                Don't have an account? <Link to="/register" className="signup-link">Create an account</Link>
                            </p>
                        </div>
                    </Card.Body>
                </Card>
                
                <div className="text-center mt-4">
                    <p className="text-muted small">
                        &copy; 2025 Tii Task Manager. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
