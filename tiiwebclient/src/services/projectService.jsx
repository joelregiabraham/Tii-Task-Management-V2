// services/projectService.js
import { authHeader, handleResponse } from '../utils/serviceHelpers';

const API_URL = 'https://localhost:7072/api';

async function addMemberByUsername(projectId, memberDetails) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: memberDetails.username,
            roleId: memberDetails.roleId
        })
    };

    const response = await fetch(`${API_URL}/projects/${projectId}/members/by-username`, requestOptions);
    return handleResponse(response);
}

export const projectService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getMembers,
    addMember,
    addMemberByUsername, 
    updateMemberRole,
    removeMember
};

async function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/projects`, requestOptions);
    return handleResponse(response);
}

async function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/projects/${id}`, requestOptions);
    return handleResponse(response);
}

async function create(project) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    };

    const response = await fetch(`${API_URL}/projects`, requestOptions);
    return handleResponse(response);
}

async function update(project) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
    };

    const response = await fetch(`${API_URL}/projects/${project.projectId}`, requestOptions);
    return handleResponse(response);
}

async function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/projects/${id}`, requestOptions);
    return handleResponse(response);
}

async function getMembers(projectId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/projects/${projectId}/members`, requestOptions);
    return handleResponse(response);
}

async function addMember(projectId, memberDetails) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(memberDetails)
    };

    const response = await fetch(`${API_URL}/projects/${projectId}/members`, requestOptions);
    return handleResponse(response);
}

async function updateMemberRole(projectId, userId, roleId) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
    };

    const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, requestOptions);
    return handleResponse(response);
}

async function removeMember(projectId, userId) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, requestOptions);
    return handleResponse(response);
}