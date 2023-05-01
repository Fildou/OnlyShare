using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using System.Security.Claims;
using OnlyShare.Contracts;

namespace OnlyShare.Controllers
{
    [ApiController]
    [Authorize]
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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<GetProfileResponse>> GetProfile([FromQuery] GetProfileRequest request)
        {
            var user = await _userRepository.GetUserAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new GetProfileResponse { ProfilePictureUrl = user.ProfilePictureUrl, Username = user.Username, ProfileInfo = user.ProfileInfo });
        }

        [HttpPut]
        public async Task<ActionResult<UpdateProfileResponse>> UpdateProfile([FromForm] UpdateProfileRequest request)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.ProfileInfo = request.ProfileInfo;

            string profilePictureUrl = user.ProfilePictureUrl;
            if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
            {
                var uploads = Path.Combine(_environment.WebRootPath, "uploads");
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.ProfilePicture.FileName;
                var filePath = Path.Combine(uploads, uniqueFileName);

                using var fileStream = new FileStream(filePath, FileMode.Create);
                await request.ProfilePicture.CopyToAsync(fileStream);

                profilePictureUrl = "/uploads/" + uniqueFileName;
                user.ProfilePictureUrl = profilePictureUrl;
            }

            await _userRepository.UpdateUserProfileAsync(user);

            var response = new UpdateProfileResponse
            {
                ProfilePictureUrl = profilePictureUrl,
                ProfileInfo = user.ProfileInfo
            };

            return Ok(response);
        }


        [HttpPost("isProfileOwner")]
        public async Task<ActionResult<IsProfileOwnerResponse>> IsProfileOwner([FromQuery] IsProfileOwnerRequest request)
        {
            try
            {
                var loggedInUser = HttpContext.Items["User"] as User;
                if (loggedInUser == null)
                {
                    return Unauthorized(); // Return an unauthorized status when there is no authenticated user
                }

                var isOwner = loggedInUser.Id == request.UserId;
                return Ok(new IsProfileOwnerResponse { IsOwner = isOwner });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpPost("like")]
        public async Task<ActionResult> LikeProfile([FromRoute] Guid targetUserId)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userReaction = new UserReaction
            {
                UserId = user.Id,
                TargetUserId = targetUserId,
                IsLike = true
            };

            await _userRepository.AddOrUpdateUserReactionAsync(userReaction);
            return Ok("Profile liked successfully");
        }

        [HttpPost("dislike")]
        public async Task<ActionResult> DislikeProfile([FromQuery] Guid targetUserId)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userReaction = new UserReaction
            {
                UserId = user.Id,
                TargetUserId = targetUserId,
                IsLike = false
            };

            await _userRepository.AddOrUpdateUserReactionAsync(userReaction);
            return Ok("Profile disliked successfully");
        }

        [HttpDelete("reaction")]
        public async Task<ActionResult> RemoveReaction([FromQuery] Guid targetUserId)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userReaction = await _userRepository.GetUserReactionAsync(user.Id, targetUserId);
            if (userReaction != null)
            {
                await _userRepository.RemoveUserReactionAsync(userReaction);
                return Ok("Reaction removed successfully");
            }

            return NotFound("Reaction not found");
        }

        [AllowAnonymous]
        [HttpGet("userReaction")]
        public async Task<ActionResult<UserReaction?>> GetUserReaction([FromQuery] Guid targetUserId)
        {
            var user = HttpContext.Items["User"] as User;
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userReaction = await _userRepository.GetUserReactionAsync(user.Id, targetUserId);
            return Ok(userReaction);
        }

    }

    public class UpdateProfileRequest
    {
        public string ProfileInfo { get; set; } = string.Empty;
        public IFormFile ProfilePicture { get; set; }
    }
}