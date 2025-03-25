using Microsoft.EntityFrameworkCore;
using Task_API.Data;
using Task_API.Models;
using Task_API.Models.DTOs;

// Add this alias to resolve the ambiguity
using TaskStatus = Task_API.Models.TaskStatus;

namespace Task_API.Services
{
    public class TaskService : ITaskService
    {
        private readonly TaskDbContext _context;
        private readonly IUserService _userService;

        public TaskService(TaskDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksForUserAsync(string userId)
        {
            // Get tasks where the user is the creator or assignee
            var tasks = await _context.Tasks
                .Where(t => t.CreatedBy == userId || t.AssignedTo == userId)
                .ToListAsync();

            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                var createdByName = await _userService.GetUserNameAsync(task.CreatedBy);
                var assignedToName = task.AssignedTo != null ?
                    await _userService.GetUserNameAsync(task.AssignedTo) : null;

                taskDtos.Add(new TaskDto
                {
                    TaskId = task.TaskId,
                    ProjectId = task.ProjectId,
                    Title = task.Title,
                    Description = task.Description,
                    Status = task.Status.ToString(),
                    AssignedTo = task.AssignedTo,
                    AssignedToName = assignedToName,
                    CreatedBy = task.CreatedBy,
                    CreatedByName = createdByName,
                    CreationDate = task.CreationDate,
                    DueDate = task.DueDate,
                    LastModifiedDate = task.LastModifiedDate
                });
            }

            return taskDtos;
        }

        public async Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .ToListAsync();

            var taskDtos = new List<TaskDto>();

            foreach (var task in tasks)
            {
                var createdByName = await _userService.GetUserNameAsync(task.CreatedBy);
                var assignedToName = task.AssignedTo != null ?
                    await _userService.GetUserNameAsync(task.AssignedTo) : null;

                taskDtos.Add(new TaskDto
                {
                    TaskId = task.TaskId,
                    ProjectId = task.ProjectId,
                    Title = task.Title,
                    Description = task.Description,
                    Status = task.Status.ToString(),
                    AssignedTo = task.AssignedTo,
                    AssignedToName = assignedToName,
                    CreatedBy = task.CreatedBy,
                    CreatedByName = createdByName,
                    CreationDate = task.CreationDate,
                    DueDate = task.DueDate,
                    LastModifiedDate = task.LastModifiedDate
                });
            }

            return taskDtos;
        }

        public async Task<TaskDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);

            if (task == null)
                return null;

            var createdByName = await _userService.GetUserNameAsync(task.CreatedBy);
            var assignedToName = task.AssignedTo != null ?
                await _userService.GetUserNameAsync(task.AssignedTo) : null;

            return new TaskDto
            {
                TaskId = task.TaskId,
                ProjectId = task.ProjectId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                AssignedTo = task.AssignedTo,
                AssignedToName = assignedToName,
                CreatedBy = task.CreatedBy,
                CreatedByName = createdByName,
                CreationDate = task.CreationDate,
                DueDate = task.DueDate,
                LastModifiedDate = task.LastModifiedDate
            };
        }

        public async Task<TaskDto> CreateTaskAsync(CreateTaskDto taskDto, string userId)
        {
            // Parse the status enum from string
            if (!Enum.TryParse<TaskStatus>(taskDto.Status, out var status))
            {
                status = TaskStatus.ToDo; // Default to ToDo if invalid status
            }

            var task = new TaskItem
            {
                ProjectId = taskDto.ProjectId,
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = status,
                AssignedTo = taskDto.AssignedTo,
                CreatedBy = userId,
                CreationDate = DateTime.UtcNow,
                DueDate = taskDto.DueDate,
                LastModifiedDate = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var createdByName = await _userService.GetUserNameAsync(userId);
            var assignedToName = task.AssignedTo != null ?
                await _userService.GetUserNameAsync(task.AssignedTo) : null;

            return new TaskDto
            {
                TaskId = task.TaskId,
                ProjectId = task.ProjectId,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status.ToString(),
                AssignedTo = task.AssignedTo,
                AssignedToName = assignedToName,
                CreatedBy = task.CreatedBy,
                CreatedByName = createdByName,
                CreationDate = task.CreationDate,
                DueDate = task.DueDate,
                LastModifiedDate = task.LastModifiedDate
            };
        }

        public async Task<bool> UpdateTaskAsync(UpdateTaskDto taskDto)
        {
            var task = await _context.Tasks.FindAsync(taskDto.TaskId);

            if (task == null)
                return false;

            task.Title = taskDto.Title;
            task.Description = taskDto.Description;
            task.DueDate = taskDto.DueDate;
            task.LastModifiedDate = DateTime.UtcNow;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateTaskStatusAsync(int taskId, string status)
        {
            var task = await _context.Tasks.FindAsync(taskId);

            if (task == null)
                return false;

            // Parse the status enum from string
            if (!Enum.TryParse<TaskStatus>(status, out var newStatus))
            {
                return false; // Invalid status
            }

            task.Status = newStatus;
            task.LastModifiedDate = DateTime.UtcNow;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> AssignTaskAsync(int taskId, string userId)
        {
            var task = await _context.Tasks.FindAsync(taskId);

            if (task == null)
                return false;

            task.AssignedTo = userId;
            task.LastModifiedDate = DateTime.UtcNow;

            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            var task = await _context.Tasks.FindAsync(taskId);

            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}