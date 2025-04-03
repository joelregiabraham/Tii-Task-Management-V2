using Auth_API.Models.DTOs;
using Auth_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Auth_API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthenticationController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userForRegistration)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterUser(userForRegistration);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }
                return BadRequest(ModelState);
            }

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _authService.ValidateUser(user))
                return Unauthorized();

            var tokenDto = await _authService.CreateToken(true);
            
            //return 200OK
            return Ok(tokenDto);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto tokenDto)
        {
            try
            {
                var refreshedTokenDto = await _authService.RefreshToken(tokenDto);
                return Ok(refreshedTokenDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}