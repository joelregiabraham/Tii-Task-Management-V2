using System;

namespace Task_API.Models.DTOs
{
    public class TaskDto
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string AssignedTo { get; set; }
        public string AssignedToName { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedByName { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}