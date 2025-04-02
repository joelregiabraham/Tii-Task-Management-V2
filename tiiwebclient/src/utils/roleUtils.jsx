// utils/roleUtils.jsx
export const checkUserPermission = (user, requiredRoles) => {
    if (!user || !user.roles) return false;

    // Handle both array and string role formats
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

    // Check if user has any of the required roles
    return requiredRoles.some(role => userRoles.includes(role));
};

export const canManageProjects = (user) => {
    return checkUserPermission(user, ['ProjectManager']);
};

export const canManageTasks = (user) => {
    return checkUserPermission(user, ['ProjectManager', 'TeamMember']);
};

export const isViewer = (user) => {
    if (!user || !user.roles) return false;

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return userRoles.includes('Viewer') &&
        !userRoles.includes('ProjectManager') &&
        !userRoles.includes('TeamMember');
};