// services/projectService.js
import { authHeader, handleResponse, retryRequest } from '../utils/serviceHelpers';

const API_URL = 'https://localhost:7072/api';

async function addMemberByUsername(projectId, memberDetails) {
    return retryRequest(async () => {
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
    });
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
    return retryRequest(async () => {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/projects`, requestOptions);
        return handleResponse(response);
    });
}

async function getById(id) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/projects/${id}`, requestOptions);
        return handleResponse(response);
    });
}

async function create(project) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        };

        const response = await fetch(`${API_URL}/projects`, requestOptions);
        return handleResponse(response);
    });
}

async function update(project) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        };

        const response = await fetch(`${API_URL}/projects/${project.projectId}`, requestOptions);
        return handleResponse(response);
    });
}

async function _delete(id) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/projects/${id}`, requestOptions);
        return handleResponse(response);
    });
}

async function getMembers(projectId) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/projects/${projectId}/members`, requestOptions);
        return handleResponse(response);
    });
}

async function addMember(projectId, memberDetails) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(memberDetails)
        };

        const response = await fetch(`${API_URL}/projects/${projectId}/members`, requestOptions);
        return handleResponse(response);
    });
}

async function updateMemberRole(projectId, userId, roleId) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'PUT',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ roleId })
        };

        const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, requestOptions);
        return handleResponse(response);
    });
}

async function removeMember(projectId, userId) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'DELETE',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/projects/${projectId}/members/${userId}`, requestOptions);
        return handleResponse(response);
    });
}
