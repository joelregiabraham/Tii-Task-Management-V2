using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Task_API.Models.DTOs;
using Task_API.Services;

namespace Task_API.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IProjectService _projectService;

        public TasksController(ITaskService taskService, IProjectService projectService)
        {
            _taskService = taskService;
            _projectService = projectService;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var tasks = await _taskService.GetTasksForUserAsync(userId);
            return Ok(tasks);
        }

        // GET: api/tasks/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByProject(int projectId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has access to this project
            var hasAccess = await _projectService.UserHasProjectAccessAsync(userId, projectId);

            if (!hasAccess)
                return Forbid();

            var tasks = await _taskService.GetTasksByProjectAsync(projectId);
            return Ok(tasks);
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has access to this task's project
            var hasAccess = await _projectService.UserHasProjectAccessAsync(userId, task.ProjectId);

            if (!hasAccess)
                return Forbid();

            return Ok(task);
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskDto taskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to create tasks in this project
            var hasPermission = await _projectService.UserHasProjectRoleAsync(
                userId, taskDto.ProjectId, new[] { "ProjectManager", "TeamMember" });

            if (!hasPermission)
                return Forbid();

            var task = await _taskService.CreateTaskAsync(taskDto, userId);

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, task);
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto taskDto)
        {
            if (id != taskDto.TaskId)
                return BadRequest("Task ID in URL does not match task ID in body");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to update tasks in this project
            var hasPermission = await _projectService.UserHasProjectRoleAsync(
                userId, task.ProjectId, new[] { "ProjectManager", "TeamMember" });

            if (!hasPermission)
                return Forbid();

            var result = await _taskService.UpdateTaskAsync(taskDto);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // PUT: api/tasks/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusDto statusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to update tasks in this project
            var hasPermission = await _projectService.UserHasProjectRoleAsync(
                userId, task.ProjectId, new[] { "ProjectManager", "TeamMember" });

            if (!hasPermission)
                return Forbid();

            var result = await _taskService.UpdateTaskStatusAsync(id, statusDto.Status);

            if (!result)
                return BadRequest("Invalid status value");

            return NoContent();
        }

        // PUT: api/tasks/{id}/assign
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignTask(int id, [FromBody] AssignTaskDto assignDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to assign tasks in this project
            var hasPermission = await _projectService.UserHasProjectRoleAsync(
                userId, task.ProjectId, new[] { "ProjectManager" });

            if (!hasPermission)
                return Forbid();

            // Check if assignee is a member of the project
            var isAssigneeMember = await _projectService.IsUserProjectMemberAsync(
                assignDto.AssignedToUserId, task.ProjectId);

            if (!isAssigneeMember)
                return BadRequest("The user is not a member of this project");

            var result = await _taskService.AssignTaskAsync(id, assignDto.AssignedToUserId);

            if (!result)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);

            if (task == null)
                return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Check if user has permission to delete tasks in this project
            var hasPermission = await _projectService.UserHasProjectRoleAsync(
                userId, task.ProjectId, new[] { "ProjectManager" });

            if (!hasPermission)
                return Forbid();

            var result = await _taskService.DeleteTaskAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}