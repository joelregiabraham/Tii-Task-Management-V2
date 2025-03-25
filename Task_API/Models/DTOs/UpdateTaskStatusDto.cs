using System.ComponentModel.DataAnnotations;

namespace Task_API.Models.DTOs
{
    public class UpdateTaskStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } // "ToDo", "InProgress", or "Done"
    }
}