using System.ComponentModel.DataAnnotations;

namespace Task_API.Models.DTOs
{
    public class AssignTaskDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public string AssignedToUserId { get; set; }
    }
}