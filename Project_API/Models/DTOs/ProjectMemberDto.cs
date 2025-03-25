namespace Project_API.Models.DTOs
{
    public class ProjectMemberDto
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
    }
}