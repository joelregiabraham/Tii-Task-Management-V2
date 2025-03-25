// services/authService.js
const API_URL = 'https://localhost:7071/api';

export const authService = {
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser
};

async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    try {
        const response = await fetch(`${API_URL}/auth/login`, requestOptions);
        const data = await handleResponse(response);

        // Store user details and jwt token in local storage to keep user logged in
        localStorage.setItem('user', JSON.stringify(data));

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function register(userDetails) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails)
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, requestOptions);
        return handleResponse(response);
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

function logout() {
    // Remove user from local storage to log user out
    localStorage.removeItem('user');
}

async function refreshToken() {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser || !currentUser.refreshToken) {
        return Promise.reject('No refresh token available');
    }

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accessToken: currentUser.accessToken,
            refreshToken: currentUser.refreshToken
        })
    };

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, requestOptions);
        const data = await handleResponse(response);

        // Store the new tokens
        localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
        }));

        return data;
    } catch (error) {
        // If refresh token fails, log the user out
        logout();
        throw error;
    }
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    return JSON.parse(userStr);
}

async function handleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        if (response.status === 401) {
            // Auto logout if 401 response returned from api
            logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}