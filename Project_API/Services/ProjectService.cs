using Microsoft.EntityFrameworkCore;
using Project_API.Data;
using Project_API.Models;
using Project_API.Models.DTOs;

namespace Project_API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ProjectDbContext _context;
        private readonly IUserService _userService;

        public ProjectService(ProjectDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<IEnumerable<ProjectDto>> GetProjectsForUserAsync(string userId)
        {
            // Get projects where the user is a member
            var projectMembers = await _context.ProjectMembers
                .Where(pm => pm.UserId == userId)
                .ToListAsync();

            var projectIds = projectMembers.Select(pm => pm.ProjectId).ToList();

            var projects = await _context.Projects
                .Where(p => projectIds.Contains(p.ProjectId))
                .ToListAsync();

            var projectDtos = new List<ProjectDto>();

            foreach (var project in projects)
            {
                projectDtos.Add(new ProjectDto
                {
                    ProjectId = project.ProjectId,
                    Name = project.Name,
                    Description = project.Description,
                    CreatedBy = project.CreatedBy,
                    CreationDate = project.CreationDate,
                    LastModifiedDate = project.LastModifiedDate
                });
            }

            return projectDtos;
        }

        public async Task<ProjectDto> GetProjectByIdAsync(int projectId, string userId)
        {
            // Check if user has access to this project
            if (!await UserHasProjectAccessAsync(userId, projectId))
                return null;

            var project = await _context.Projects
                .Include(p => p.ProjectMembers)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
                return null;

            var memberDtos = new List<ProjectMemberDto>();

            foreach (var member in project.ProjectMembers)
            {
                var username = await _userService.GetUserNameAsync(member.UserId);

                memberDtos.Add(new ProjectMemberDto
                {
                    UserId = member.UserId,
                    Username = username ?? "Unknown User",
                    RoleId = member.RoleId,
                    RoleName = RoleConstants.GetRoleName(member.RoleId)
                });
            }

            return new ProjectDto
            {
                ProjectId = project.ProjectId,
                Name = project.Name,
                Description = project.Description,
                CreatedBy = project.CreatedBy,
                CreationDate = project.CreationDate,
                LastModifiedDate = project.LastModifiedDate,
                Members = memberDtos
            };
        }

        public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto projectDto, string userId)
        {
            var project = new Project
            {
                Name = projectDto.Name,
                Description = projectDto.Description,
                CreatedBy = userId,
                CreationDate = DateTime.UtcNow,
                LastModifiedDate = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Add creator as a project manager
            var projectMember = new ProjectMember
            {
                ProjectId = project.ProjectId,
                UserId = userId,
                RoleId = RoleConstants.ProjectManager
            };

            _context.ProjectMembers.Add(projectMember);
            await _context.SaveChangesAsync();

            return new ProjectDto
            {
                ProjectId = project.ProjectId,
                Name = project.Name,
                Description = project.Description,
                CreatedBy = project.CreatedBy,
                CreationDate = project.CreationDate,
                LastModifiedDate = project.LastModifiedDate,
                Members = new[]
                {
                    new ProjectMemberDto
                    {
                        UserId = userId,
                        Username = await _userService.GetUserNameAsync(userId) ?? "Unknown User",
                        RoleId = RoleConstants.ProjectManager,
                        RoleName = RoleConstants.GetRoleName(RoleConstants.ProjectManager)
                    }
                }
            };
        }

        public async Task<bool> UpdateProjectAsync(UpdateProjectDto projectDto, string userId)
        {
            // Check if user has permission to update project
            if (!await UserHasProjectRoleAsync(userId, projectDto.ProjectId, new[] { RoleConstants.ProjectManager }))
                return false;

            var project = await _context.Projects.FindAsync(projectDto.ProjectId);

            if (project == null)
                return false;

            project.Name = projectDto.Name;
            project.Description = projectDto.Description;
            project.LastModifiedDate = DateTime.UtcNow;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteProjectAsync(int projectId, string userId)
        {
            // Check if user has permission to delete project
            if (!await UserHasProjectRoleAsync(userId, projectId, new[] { RoleConstants.ProjectManager }))
                return false;

            var project = await _context.Projects.FindAsync(projectId);

            if (project == null)
                return false;

            // Delete all project members first (to handle the foreign key constraint)
            var projectMembers = await _context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync();

            _context.ProjectMembers.RemoveRange(projectMembers);

            // Then delete the project
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ProjectMemberDto>> GetProjectMembersAsync(int projectId)
        {
            var members = await _context.ProjectMembers
                .Where(pm => pm.ProjectId == projectId)
                .ToListAsync();

            var memberDtos = new List<ProjectMemberDto>();

            foreach (var member in members)
            {
                var username = await _userService.GetUserNameAsync(member.UserId);

                memberDtos.Add(new ProjectMemberDto
                {
                    UserId = member.UserId,
                    Username = username ?? "Unknown User",
                    RoleId = member.RoleId,
                    RoleName = RoleConstants.GetRoleName(member.RoleId)
                });
            }

            return memberDtos;
        }

        public async Task<bool> AddProjectMemberAsync(int projectId, AddProjectMemberDto memberDto)
        {
            // Check if the user exists
            if (!await _userService.UserExistsAsync(memberDto.UserId))
                return false;

            // Check if the user is already a member of this project
            var existingMember = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == memberDto.UserId);

            if (existingMember != null)
            {
                // User is already a member, update their role
                existingMember.RoleId = memberDto.RoleId;
                _context.ProjectMembers.Update(existingMember);
            }
            else
            {
                // Add the user as a new member
                var projectMember = new ProjectMember
                {
                    ProjectId = projectId,
                    UserId = memberDto.UserId,
                    RoleId = memberDto.RoleId
                };

                _context.ProjectMembers.Add(projectMember);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateProjectMemberRoleAsync(int projectId, string userId, int roleId)
        {
            var member = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);

            if (member == null)
                return false;

            member.RoleId = roleId;
            _context.ProjectMembers.Update(member);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveProjectMemberAsync(int projectId, string userId)
        {
            var member = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);

            if (member == null)
                return false;

            _context.ProjectMembers.Remove(member);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UserHasProjectRoleAsync(string userId, int projectId, int[] allowedRoles)
        {
            var member = await _context.ProjectMembers
                .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);

            if (member == null)
                return false;

            return allowedRoles.Contains(member.RoleId);
        }

        public async Task<bool> UserHasProjectAccessAsync(string userId, int projectId)
        {
            return await _context.ProjectMembers
                .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId);
        }
    }
}