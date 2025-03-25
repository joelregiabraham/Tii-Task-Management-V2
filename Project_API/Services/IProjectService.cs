using Project_API.Models;
using Project_API.Models.DTOs;

namespace Project_API.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetProjectsForUserAsync(string userId);
        Task<ProjectDto> GetProjectByIdAsync(int projectId, string userId);
        Task<ProjectDto> CreateProjectAsync(CreateProjectDto projectDto, string userId);
        Task<bool> UpdateProjectAsync(UpdateProjectDto projectDto, string userId);
        Task<bool> DeleteProjectAsync(int projectId, string userId);
        Task<IEnumerable<ProjectMemberDto>> GetProjectMembersAsync(int projectId);
        Task<bool> AddProjectMemberAsync(int projectId, AddProjectMemberDto memberDto);
        Task<bool> UpdateProjectMemberRoleAsync(int projectId, string userId, int roleId);
        Task<bool> RemoveProjectMemberAsync(int projectId, string userId);
        Task<bool> UserHasProjectRoleAsync(string userId, int projectId, int[] allowedRoles);
        Task<bool> UserHasProjectAccessAsync(string userId, int projectId);
    }
}