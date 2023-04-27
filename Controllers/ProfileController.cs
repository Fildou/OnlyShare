using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using System.Security.Claims;

namespace OnlyShare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public ProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<User>> GetProfile([FromQuery] Guid userId)
        {
            var user = await _userRepository.GetUserAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new { user.ProfilePictureUrl, user.Username, user.ProfileInfo });
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.ProfileInfo = request.ProfileInfo;
            user.ProfilePictureUrl = request.ProfilePictureUrl;

            await _userRepository.UpdateUserProfileAsync(user);
            return Ok("Profile updated successfully");
        }

        [HttpGet("isProfileOwner")]
        [AllowAnonymous]
        public async Task<ActionResult<bool>> IsProfileOwner([FromQuery] Guid userId)
        {
            var loggedInUser = HttpContext.Items["User"] as User;
            if (loggedInUser == null)
            {
                return Ok(false); // Return false when there is no authenticated user
            }
            return Ok(loggedInUser.Id == userId);
        }
    }

    public class UpdateProfileRequest
    {
        public string ProfileInfo { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;
    }
}