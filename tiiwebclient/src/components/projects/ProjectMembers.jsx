// components/projects/ProjectMembers.js
import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { Card, Form, Button, ListGroup, Badge, Alert } from 'react-bootstrap';

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
            await projectService.addMemberByUsername(projectId, newMember);
            await fetchMembers();
            if (onMemberUpdate) onMemberUpdate();
            setShowAddForm(false);
            setNewMember({ username: '', roleId: '' });
            setError('');
        } catch (err) {
            console.error('Error adding member:', err);
            setError('Failed to add member. Please check the username and try again.');
        }
    };

    

    const handleRoleChange = async (userId, roleId) => {
        try {
            await projectService.updateMemberRole(projectId, userId, roleId);
            await fetchMembers();
            if (onMemberUpdate) onMemberUpdate();
            setError('');
        } catch (err) {
            console.error('Error updating member role:', err);
            setError('Failed to update member role.');
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Are you sure you want to remove this member from the project?')) {
            try {
                await projectService.removeMember(projectId, userId);
                await fetchMembers();
                if (onMemberUpdate) onMemberUpdate();
                setError('');
            } catch (err) {
                console.error('Error removing member:', err);
                setError('Failed to remove member.');
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

    if (loading) {
        return <div>Loading members...</div>;
    }

    return (
        <Card>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <ListGroup className="mb-3">
                    {members.length === 0 ? (
                        <ListGroup.Item>No members found.</ListGroup.Item>
                    ) : (
                        members.map(member => (
                            <ListGroup.Item key={member.userId} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div>{member.username}</div>
                                    <Badge bg={getRoleBadgeColor(member.roleId)}>{member.roleName}</Badge>
                                </div>
                                <div className="d-flex">
                                    <Form.Select
                                        size="sm"
                                        className="me-2"
                                        value={member.roleId}
                                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                                        style={{ width: '120px' }}
                                    >
                                        <option value="1">ProjectManager</option>
                                        <option value="2">TeamMember</option>
                                        <option value="3">Viewer</option>
                                    </Form.Select>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRemoveMember(member.userId)}
                                    >
                                        X
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    )}
                </ListGroup>

                {showAddForm ? (
                    <Form onSubmit={handleAddMember}>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={newMember.username}
                                onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
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
                                onChange={(e) => setNewMember({ ...newMember, roleId: e.target.value })}
                                required
                            >
                                <option value="">Select a role</option>
                                <option value="1">ProjectManager</option>
                                <option value="2">TeamMember</option>
                                <option value="3">Viewer</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Member
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => setShowAddForm(true)}
                        className="w-100"
                    >
                        Add Member
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProjectMembers;