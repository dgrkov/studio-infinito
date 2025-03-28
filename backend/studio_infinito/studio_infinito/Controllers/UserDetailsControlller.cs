using DTOs;
using Microsoft.AspNetCore.Mvc;
using studio_infinito.DTOs;
using studio_infinito.Services;

namespace studio_infinito.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserDetailsControlller : Controller
    {
        IUserDetailsService _userDetailsService;

        public UserDetailsControlller(IUserDetailsService userDetailsService)
        {
            _userDetailsService = userDetailsService;
        }

        [HttpGet("{userId}")]

        public async Task<IActionResult> GetUserdetails(int userId)
        {
            try
            {
                return Ok(await _userDetailsService.FindUserById(userId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("confirm-update")]

        public async Task<IActionResult> ConfirmUpdate([FromBody] UserDetailsDTO userToUpdate)
        {
            try
            {
                return Ok(await _userDetailsService.UpdateUser(userToUpdate));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
