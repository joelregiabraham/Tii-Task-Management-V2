// services/taskService.js
import { authHeader, handleResponse } from '../utils/serviceHelpers';

const API_URL = 'https://localhost:7073/api';

export const taskService = {
    getAll,
    getByProject,
    getById,
    create,
    update,
    updateStatus,
    assign,
    delete: _delete
};

async function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks`, requestOptions);
    return handleResponse(response);
}

async function getByProject(projectId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks/project/${projectId}`, requestOptions);
    return handleResponse(response);
}

async function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks/${id}`, requestOptions);
    return handleResponse(response);
}

async function create(task) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    };

    const response = await fetch(`${API_URL}/tasks`, requestOptions);
    return handleResponse(response);
}

async function update(task) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    };

    const response = await fetch(`${API_URL}/tasks/${task.taskId}`, requestOptions);
    return handleResponse(response);
}

async function updateStatus(taskId, status) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    };

    const response = await fetch(`${API_URL}/tasks/${taskId}/status`, requestOptions);
    return handleResponse(response);
}

async function assign(taskId, userId) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToUserId: userId })
    };

    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, requestOptions);
    return handleResponse(response);
}

async function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks/${id}`, requestOptions);
    return handleResponse(response);
}