namespace Project_API.Models
{
    public static class RoleConstants
    {
        public const int ProjectManager = 1;
        public const int TeamMember = 2;
        public const int Viewer = 3;

        public static string GetRoleName(int roleId)
        {
            return roleId switch
            {
                ProjectManager => "ProjectManager",
                TeamMember => "TeamMember",
                Viewer => "Viewer",
                _ => "Unknown"
            };
        }
    }
}