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

    const response = await fetch(`${API_URL}/auth/login`, requestOptions);
    const data = await handleResponse(response);

    // Optional: if your backend sends expiry info, save it
    // localStorage.setItem('user', JSON.stringify({ ...data, expiry: Date.now() + 60 * 60 * 1000 }));
    localStorage.setItem('user', JSON.stringify(data));

    return data;
}

async function register(userDetails) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails)
    };

    const response = await fetch(`${API_URL}/auth/register`, requestOptions);
    return handleResponse(response);
}

function logout() {
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

    const response = await fetch(`${API_URL}/auth/refresh`, requestOptions);
    const data = await handleResponse(response);

    // Save new token
    localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
    }));

    return data;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
}

// ? FIXED: Don’t logout here!
async function handleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        // Instead of logging out — let retryRequest decide what to do
        if ([401, 403].includes(response.status)) {
            return Promise.reject('Unauthorized');
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}
