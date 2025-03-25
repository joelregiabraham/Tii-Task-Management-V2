using System;
using System.ComponentModel.DataAnnotations;

namespace Task_API.Models.DTOs
{
    public class CreateTaskDto
    {
        [Required(ErrorMessage = "Project ID is required")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } // "ToDo", "InProgress", or "Done"

        public string AssignedTo { get; set; } // Optional: User ID

        public DateTime? DueDate { get; set; }
    }
}