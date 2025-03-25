using Task_API.Models;
using Task_API.Models.DTOs;

namespace Task_API.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetTasksForUserAsync(string userId);
        Task<IEnumerable<TaskDto>> GetTasksByProjectAsync(int projectId);
        Task<TaskDto> GetTaskByIdAsync(int taskId);
        Task<TaskDto> CreateTaskAsync(CreateTaskDto taskDto, string userId);
        Task<bool> UpdateTaskAsync(UpdateTaskDto taskDto);
        Task<bool> UpdateTaskStatusAsync(int taskId, string status);
        Task<bool> AssignTaskAsync(int taskId, string userId);
        Task<bool> DeleteTaskAsync(int taskId);
    }
}