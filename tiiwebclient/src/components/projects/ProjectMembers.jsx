import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { Form, Button, ListGroup, Badge, Alert, Accordion } from 'react-bootstrap';
import './ProjectMembers.css';

const ProjectMembers = ({ projectId, onMemberUpdate }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({
        username: '',
        roleId: ''
    });

    useEffect(() => {
        fetchMembers();
    }, [projectId]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await projectService.getMembers(projectId);
            setMembers(data);
            setError('');
        } catch (err) {
            console.error('Error fetching project members:', err);
            setError('Failed to load project members.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        
        if (!newMember.username || !newMember.roleId) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);
            await projectService.addMemberByUsername(projectId, newMember);
            await fetchMembers();
            if (onMemberUpdate) onMemberUpdate();
            setShowAddForm(false);
            setNewMember({ username: '', roleId: '' });
            setError('');
        } catch (err) {
            console.error('Error adding member:', err);
            setError('Failed to add member. Please check the username and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, roleId) => {
        try {
            setLoading(true);
            await projectService.updateMemberRole(projectId, userId, roleId);
            await fetchMembers();
            if (onMemberUpdate) onMemberUpdate();
            setError('');
        } catch (err) {
            console.error('Error updating member role:', err);
            setError('Failed to update member role.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Are you sure you want to remove this member from the project?')) {
            try {
                setLoading(true);
                await projectService.removeMember(projectId, userId);
                await fetchMembers();
                if (onMemberUpdate) onMemberUpdate();
                setError('');
            } catch (err) {
                console.error('Error removing member:', err);
                setError('Failed to remove member.');
            } finally {
                setLoading(false);
            }
        }
    };

    const getRoleBadgeColor = (roleId) => {
        switch (parseInt(roleId)) {
            case 1: return 'danger'; // ProjectManager
            case 2: return 'primary'; // TeamMember
            case 3: return 'info'; // Viewer
            default: return 'secondary';
        }
    };

    const getRoleName = (roleId) => {
        switch (parseInt(roleId)) {
            case 1: return 'Project Manager';
            case 2: return 'Team Member';
            case 3: return 'Viewer';
            default: return 'Unknown Role';
        }
    };

    if (loading && members.length === 0) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading members...</span>
                </div>
                <p className="mt-2 mb-0">Loading members...</p>
            </div>
        );
    }

    return (
        <div className="members-container">
            {error && <Alert variant="danger" className="m-3">{error}</Alert>}

            <div className="members-list">
                {members.length === 0 ? (
                    <div className="text-center p-4">
                        <p className="text-muted mb-0">No members found.</p>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {members.map(member => (
                            <ListGroup.Item key={member.userId} className="member-item">
                                <div className="member-info">
                                    <div className="member-avatar">
                                        {member.username ? member.username.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="member-details">
                                        <div className="member-name">{member.username}</div>
                                        <Badge bg={getRoleBadgeColor(member.roleId)} className="member-role">
                                            {getRoleName(member.roleId)}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="member-actions dropdown">
                                    <button className="btn btn-sm btn-link dropdown-toggle" type="button" id={`member-dropdown-${member.userId}`} data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="12" cy="5" r="1"></circle>
                                            <circle cx="12" cy="19" r="1"></circle>
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`member-dropdown-${member.userId}`}>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={() => handleRoleChange(member.userId, "1")}
                                                disabled={member.roleId === "1"}
                                            >
                                                Make Project Manager
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={() => handleRoleChange(member.userId, "2")}
                                                disabled={member.roleId === "2"}
                                            >
                                                Make Team Member
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                onClick={() => handleRoleChange(member.userId, "3")}
                                                disabled={member.roleId === "3"}
                                            >
                                                Make Viewer
                                            </button>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button 
                                                className="dropdown-item text-danger" 
                                                onClick={() => handleRemoveMember(member.userId)}
                                            >
                                                Remove from Project
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>

            <div className="p-3">
                {showAddForm ? (
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Add Member</Accordion.Header>
                            <Accordion.Body>
                                <Form onSubmit={handleAddMember}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newMember.username}
                                            onChange={(e) => setNewMember({...newMember, username: e.target.value})}
                                            required
                                            placeholder="Enter username"
                                        />
                                        <Form.Text className="text-muted">
                                            Enter the exact username of the person you want to add
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select
                                            value={newMember.roleId}
                                            onChange={(e) => setNewMember({...newMember, roleId: e.target.value})}
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            <option value="1">Project Manager</option>
                                            <option value="2">Team Member</option>
                                            <option value="3">Viewer</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Adding...
                                                </>
                                            ) : (
                                                'Add Member'
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                ) : (
                    <Button 
                        variant="primary" 
                        onClick={() => setShowAddForm(true)}
                        className="w-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        Add Member
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProjectMembers;
