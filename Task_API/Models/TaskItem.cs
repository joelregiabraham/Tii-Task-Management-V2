using System;
using System.ComponentModel.DataAnnotations;

namespace Task_API.Models
{
    public class TaskItem
    {
        [Key]
        public int TaskId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public TaskStatus Status { get; set; }

        public string AssignedTo { get; set; } // User ID from Auth_API

        [Required]
        public string CreatedBy { get; set; } // User ID from Auth_API

        public DateTime CreationDate { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime LastModifiedDate { get; set; }
    }
}