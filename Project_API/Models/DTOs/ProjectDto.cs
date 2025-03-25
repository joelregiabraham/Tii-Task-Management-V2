using System;
using System.Collections.Generic;

namespace Project_API.Models.DTOs
{
    public class ProjectDto
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public IEnumerable<ProjectMemberDto> Members { get; set; }
    }
}