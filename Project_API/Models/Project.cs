using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Project_API.Models
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public string CreatedBy { get; set; } // User ID from Auth_API

        public DateTime CreationDate { get; set; }

        public DateTime LastModifiedDate { get; set; }

        // Navigation property
        public virtual ICollection<ProjectMember> ProjectMembers { get; set; }
    }
}