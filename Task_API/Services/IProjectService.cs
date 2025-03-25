namespace Task_API.Services
{
    public interface IProjectService
    {
        
        Task<bool> ProjectExistsAsync(int projectId);
        Task<bool> UserHasProjectAccessAsync(string userId, int projectId);
        Task<bool> UserHasProjectRoleAsync(string userId, int projectId, string[] allowedRoles);
        Task<bool> IsUserProjectMemberAsync(string userId, int projectId);
    }
}