using System.ComponentModel.DataAnnotations;

namespace Project_API.Models.DTOs
{
    public class UpdateProjectMemberRoleDto
    {
        [Required(ErrorMessage = "Role ID is required")]
        public int RoleId { get; set; }
    }
}