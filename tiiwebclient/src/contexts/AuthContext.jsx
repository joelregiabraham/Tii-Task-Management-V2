// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            // If user exists in local storage, check if we need to parse JWT
            if (!currentUser.roles && currentUser.accessToken) {
                const decodedToken = parseJwtToken(currentUser.accessToken);
                currentUser.roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            }
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const parseJwtToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (err) {
            console.error('Error parsing JWT token:', err);
            return {};
        }
    };

    const login = async (username, password) => {
        try {
            setLoading(true);
            setError(null);
            const tokenResponse = await authService.login(username, password);

            // Extract user info from the JWT token
            const decodedToken = parseJwtToken(tokenResponse.accessToken);

            // Create a user object with token and decoded info
            const user = {
                ...tokenResponse,
                ...decodedToken,
                roles: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || []
            };

            setUser(user);
            return user;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userDetails) => {
        try {
            setLoading(true);
            setError(null);
            await authService.register(userDetails);
            // Auto login after registration
            return await login(userDetails.username, userDetails.password);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};