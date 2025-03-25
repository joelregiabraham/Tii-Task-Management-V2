using Auth_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auth_API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/users/exists/{id}
        [HttpGet("exists/{id}")]
        public async Task<IActionResult> UserExists(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user != null ? Ok() : NotFound();
        }

        // GET: api/users/{id}/username
        [HttpGet("{id}/username")]
        public async Task<IActionResult> GetUsername(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user != null ? Ok(user.UserName) : NotFound();
        }
    }
}