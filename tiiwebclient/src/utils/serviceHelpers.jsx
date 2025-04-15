// utils/serviceHelpers.js
import { authService } from '../services/authService';

export function authHeader() {
    // Return auth header with jwt token
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
        return { 'Authorization': `Bearer ${user.accessToken}` };
    } else {
        return {};
    }
}

export async function handleResponse(response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
        const error = (data && data.message) || response.statusText;

        if ([401, 403].includes(response.status)) {
            // Let retryRequest decide whether to logout
            return Promise.reject('Unauthorized');
        }

        return Promise.reject(error);
    }

    return data;
}


export async function retryRequest(requestFunc) {
    try {
        return await requestFunc(); // First try
    } catch (error) {
        if (error === 'Unauthorized') {
            try {
                await authService.refreshToken(); // Try refreshing
                return await requestFunc(); // Retry original request
            } catch (refreshError) {
                authService.logout();
                window.location.href = '/login';
                throw refreshError;
            }
        }

        throw error;
    }
}
