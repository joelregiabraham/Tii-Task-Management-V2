using System.ComponentModel.DataAnnotations;

namespace Project_API.Models.DTOs
{
    public class AddProjectMemberDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Role ID is required")]
        public int RoleId { get; set; }
    }
}