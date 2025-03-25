using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project_API.Models.DTOs;
using Project_API.Services;
using System.Security.Claims;

using Project_API.Models;
namespace Project_API.Controllers
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var projects = await _projectService.GetProjectsForUserAsync(userId);
            return Ok(projects);
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _projectService.GetProjectByIdAsync(id, userId);

            if (project == null)
                return NotFound();

            return Ok(project);
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto projectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _projectService.CreateProjectAsync(projectDto, userId);

            return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, project);
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectDto projectDto)
        {
            if (id != projectDto.ProjectId)
                return BadRequest("Project ID in URL does not match project ID in body");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _projectService.UpdateProjectAsync(projectDto, userId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _projectService.DeleteProjectAsync(id, userId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // GET: api/projects/{id}/members
        [HttpGet("{id}/members")]
        public async Task<ActionResult<IEnumerable<ProjectMemberDto>>> GetProjectMembers(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has access to this project
            if (!await _projectService.UserHasProjectAccessAsync(userId, id))
                return Forbid();

            var members = await _projectService.GetProjectMembersAsync(id);
            return Ok(members);
        }

        // POST: api/projects/{id}/members
        [HttpPost("{id}/members")]
        public async Task<IActionResult> AddProjectMember(int id, [FromBody] AddProjectMemberDto memberDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to manage members
            if (!await _projectService.UserHasProjectRoleAsync(userId, id, new[] { RoleConstants.ProjectManager }))
                return Forbid();

            var result = await _projectService.AddProjectMemberAsync(id, memberDto);

            if (!result)
                return BadRequest("Failed to add project member. Verify that the user exists.");

            return NoContent();
        }

        // PUT: api/projects/{id}/members/{memberId}
        [HttpPut("{id}/members/{memberId}")]
        public async Task<IActionResult> UpdateProjectMemberRole(int id, string memberId, [FromBody] UpdateProjectMemberRoleDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to manage members
            if (!await _projectService.UserHasProjectRoleAsync(userId, id, new[] { RoleConstants.ProjectManager }))
                return Forbid();

            var result = await _projectService.UpdateProjectMemberRoleAsync(id, memberId, updateDto.RoleId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/projects/{id}/members/{memberId}
        [HttpDelete("{id}/members/{memberId}")]
        public async Task<IActionResult> RemoveProjectMember(int id, string memberId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to manage members
            if (!await _projectService.UserHasProjectRoleAsync(userId, id, new[] { RoleConstants.ProjectManager }))
                return Forbid();

            var result = await _projectService.RemoveProjectMemberAsync(id, memberId);

            if (!result)
                return NotFound();

            return NoContent();
        }



        // Endpoints to Project_API for Task_API to Use

        // GET: api/projects/{id}/exists
        [HttpGet("{id}/exists")]
        public async Task<IActionResult> ProjectExists(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id, User.FindFirstValue(ClaimTypes.NameIdentifier));
            return project != null ? Ok() : NotFound();
        }

        // GET: api/projects/{id}/members/{userId}/access
        [HttpGet("{id}/members/{userId}/access")]
        public async Task<IActionResult> UserHasAccess(int id, string userId)
        {
            var hasAccess = await _projectService.UserHasProjectAccessAsync(userId, id);
            return hasAccess ? Ok() : Forbid();
        }

        // GET: api/projects/{id}/members/{userId}/role
        [HttpGet("{id}/members/{userId}/role")]
        public async Task<IActionResult> UserHasRole(int id, string userId, [FromQuery] string allowedRoles)
        {
            var roleStrings = allowedRoles.Split(',');
            var roleIds = new int[roleStrings.Length];

            for (int i = 0; i < roleStrings.Length; i++)
            {
                // Convert role names to role IDs
                roleIds[i] = roleStrings[i] switch
                {
                    "ProjectManager" => RoleConstants.ProjectManager,
                    "TeamMember" => RoleConstants.TeamMember,
                    "Viewer" => RoleConstants.Viewer,
                    _ => -1 // Invalid role
                };
            }

            var hasRole = await _projectService.UserHasProjectRoleAsync(userId, id, roleIds);
            return hasRole ? Ok() : Forbid();
        }

        // GET: api/projects/{id}/members/{userId}
        [HttpGet("{id}/members/{userId}")]
        public async Task<IActionResult> IsUserProjectMember(int id, string userId)
        {
            var isMember = await _projectService.UserHasProjectAccessAsync(userId, id);
            return isMember ? Ok() : NotFound();
        }
    }
}