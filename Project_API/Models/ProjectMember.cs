using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_API.Models
{
    public class ProjectMember
    {
        [Key]
        [Column(Order = 0)]
        public int ProjectId { get; set; }

        [Key]
        [Column(Order = 1)]
        public string UserId { get; set; }

        public int RoleId { get; set; } // 1=ProjectManager, 2=TeamMember, 3=Viewer

        // Navigation property
        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }
    }
}