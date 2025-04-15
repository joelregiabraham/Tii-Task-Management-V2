// services/taskService.js
import { authHeader, handleResponse, retryRequest } from '../utils/serviceHelpers';

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
    return retryRequest(async () => {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/tasks`, requestOptions);
        return handleResponse(response);
    });
}

async function getByProject(projectId) {
    return retryRequest(async () => {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks/project/${projectId}`, requestOptions);
        return handleResponse(response);
    });
}

async function getById(id) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'GET',
            headers: authHeader()
        };

        const response = await fetch(`${API_URL}/tasks/${id}`, requestOptions);
        return handleResponse(response);
    });
}

async function create(task) {
    return retryRequest(async () => {
        const requestOptions = {
            method: 'POST',
            headers: { ...authHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        };

        const response = await fetch(`${API_URL}/tasks`, requestOptions);
        return handleResponse(response);
    });
}

async function update(task) {
    return retryRequest(async () => {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    };

    const response = await fetch(`${API_URL}/tasks/${task.taskId}`, requestOptions);
        return handleResponse(response);
    });
}

async function updateStatus(taskId, status) {
    return retryRequest(async () => {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    };

    const response = await fetch(`${API_URL}/tasks/${taskId}/status`, requestOptions);
        return handleResponse(response);
    });
}

async function assign(taskId, userId) {
    return retryRequest(async () => {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToUserId: userId })
    };

    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, requestOptions);
        return handleResponse(response);
    });
}

async function _delete(id) {
    return retryRequest(async () => {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    const response = await fetch(`${API_URL}/tasks/${id}`, requestOptions);
        return handleResponse(response);
    });
}