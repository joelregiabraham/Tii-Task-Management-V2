using System;
using System.ComponentModel.DataAnnotations;

namespace Task_API.Models.DTOs
{
    public class UpdateTaskDto
    {
        public int TaskId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
        public string Title { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
        public string Description { get; set; }

        public DateTime? DueDate { get; set; }
    }
}