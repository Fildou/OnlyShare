using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
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

        private readonly IWebHostEnvironment _environment;

        public ProfileController(IUserRepository userRepository, IWebHostEnvironment environment)
        {
            _userRepository = userRepository;
            _environment = environment;
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
        public async Task<ActionResult> UpdateProfile([FromForm] UpdateProfileRequest request)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.ProfileInfo = request.ProfileInfo;

            if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
            {
                var uploads = Path.Combine(_environment.WebRootPath, "uploads");
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ProfilePicture.FileName;
                var filePath = Path.Combine(uploads, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await request.ProfilePicture.CopyToAsync(fileStream);

                user.ProfilePictureUrl = "/uploads/" + uniqueFileName;
            }

            await _userRepository.UpdateUserProfileAsync(user);
            return Ok("Profile updated successfully");
        }

        [HttpGet("isProfileOwner")]
        public async Task<ActionResult<bool>> IsProfileOwner([FromQuery] Guid userId)
        {
            try
            {
                var loggedInUser = HttpContext.Items["User"] as User;
                if (loggedInUser == null)
                {
                    return Unauthorized(); // Return an unauthorized status when there is no authenticated user
                }
                return Ok(loggedInUser.Id == userId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class UpdateProfileRequest
    {
        public string ProfileInfo { get; set; } = string.Empty;
        public IFormFile ProfilePicture { get; set; }
    }
}