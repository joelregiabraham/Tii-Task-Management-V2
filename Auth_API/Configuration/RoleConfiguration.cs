using Auth_API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth_API.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
                new IdentityRole
                {
                    Id = "1",
                    Name = RoleConstants.ProjectManager,
                    NormalizedName = RoleConstants.ProjectManager.ToUpper()
                },
                new IdentityRole
                {
                    Id = "2",
                    Name = RoleConstants.TeamMember,
                    NormalizedName = RoleConstants.TeamMember.ToUpper()
                },
                new IdentityRole
                {
                    Id = "3",
                    Name = RoleConstants.Viewer,
                    NormalizedName = RoleConstants.Viewer.ToUpper()
                }
            );
        }
    }
}