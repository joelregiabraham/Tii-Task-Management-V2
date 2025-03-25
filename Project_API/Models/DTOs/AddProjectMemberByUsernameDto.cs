using System.ComponentModel.DataAnnotations;

public class AddProjectMemberByUsernameDto
{
    [Required(ErrorMessage = "Username is required")]
    public string? Username { get; set; }

    [Required(ErrorMessage = "Role ID is required")]
    public int RoleId { get; set; }
}