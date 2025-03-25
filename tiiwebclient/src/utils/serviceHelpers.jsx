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
        if ([401, 403].includes(response.status)) {
            // Auto logout if 401 Unauthorized or 403 Forbidden response
            authService.logout();
            window.location.reload();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
    }

    return data;
}