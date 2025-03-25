using Auth_API.Models.DTOs;
using Microsoft.AspNetCore.Identity;

namespace Auth_API.Services
{
    public interface IAuthenticationService
    {
        Task<IdentityResult> RegisterUser(UserRegistrationDto userForRegistration);
        Task<bool> ValidateUser(UserLoginDto userForLogin);
        Task<TokenDto> CreateToken(bool populateExp);
        Task<TokenDto> RefreshToken(RefreshTokenDto tokenDto);
    }
}