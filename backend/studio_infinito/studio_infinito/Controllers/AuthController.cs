using DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using studio_infinito.Services;

namespace studio_infinito.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginRequest)
        {
            var userToken = await _authService.Login(loginRequest);

            if (userToken != null)
            {
                return Ok(userToken);
            }
            else
            {
                return BadRequest("Invalid username or password");
            }
        }

        [HttpPost("/register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerRequest)
        {
            var isUserCreated = await _authService.Register(registerRequest);

            if (isUserCreated != null)
                return Ok();
            else
                return BadRequest("User already exists");
        }
    }
}
