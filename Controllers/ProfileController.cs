using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

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
            if (Guid.TryParse(userId.ToString(), out Guid guid))
            {
                var user = await _userRepository.GetUserAsync(guid);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var loggedInUserId = HttpContext.User.FindFirstValue("id");

                // Add the following code to get the user ID from the JWT token
                var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                if (token != null)
                {
                    var jwt = new JwtSecurityToken(token);
                    var userIdFromToken = jwt.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
                    if (userIdFromToken != null)
                    {
                        loggedInUserId = userIdFromToken;
                    }
                }

                return Ok(new
                {
                    user.Username,
                    user.ProfileInfo,
                    LoggedInUserId = loggedInUserId,
                    user.Likes,
                    user.Dislikes
                });
            }

            return BadRequest("Invalid user ID");
        }

        [HttpPut("UpdateProfile/{userId}")]
        public async Task<ActionResult> UpdateProfile(Guid userId, [FromForm] UpdateProfileRequest request)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token == null)
            {
                return Unauthorized("Authentication token not found.");
            }

            var jwt = new JwtSecurityToken(token);
            var loggedInUserId = jwt.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (loggedInUserId == null)
            {
                return Unauthorized("User not found in the authentication token.");
            }

            if (Guid.TryParse(loggedInUserId, out Guid guid))
            {
                if (guid != userId)
                {
                    return Unauthorized("You can only update your own profile.");
                }

                var user = await _userRepository.GetUserAsync(guid);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                user.ProfileInfo = request.ProfileInfo;

                await _userRepository.UpdateUserProfileAsync(user);
                return Ok("Profile updated successfully");
            }

            return BadRequest("Invalid user ID");
        }

        [HttpPost("AddReaction/{userId}/{reaction}")]
        public async Task<ActionResult> AddReaction(Guid userId, string reaction)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token == null)
            {
                return Unauthorized("Authentication token not found.");
            }

            var jwt = new JwtSecurityToken(token);
            var loggedInUserId = jwt.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (loggedInUserId == null)
            {
                return Unauthorized("User not found in the authentication token.");
            }

            if (Guid.TryParse(loggedInUserId, out Guid guid))
            {
                if (guid == userId)
                {
                    return BadRequest("You cannot react to your own profile.");
                }

                var targetUser = await _userRepository.GetUserAsync(userId);
                if (targetUser == null)
                {
                    return NotFound("User not found");
                }

                // Check if a reaction between these users already exists
                var existingReaction = await _userRepository.GetReactionAsync(guid, userId);

                // Update or create a reaction
                if (existingReaction != null)
                {
                    // If the existing reaction type is the same as the new one, remove the reaction
                    if (existingReaction.ReactionType.ToString().ToLower() == reaction.ToLower())
                    {
                        await _userRepository.DeleteReactionAsync(existingReaction);

                        // Decrement the appropriate count
                        if (reaction.ToLower() == "like")
                        {
                            targetUser.Likes--;
                        }
                        else
                        {
                            targetUser.Dislikes--;
                        }
                    }
                    else
                    {
                        // Otherwise, update the reaction
                        existingReaction.ReactionType = reaction.ToLower() == "like" ? ReactionType.Like : ReactionType.Dislike;
                        await _userRepository.UpdateReactionAsync(existingReaction);

                        // Update the appropriate counts
                        if (reaction.ToLower() == "like")
                        {
                            targetUser.Likes++;
                            targetUser.Dislikes--;
                        }
                        else
                        {
                            targetUser.Likes--;
                            targetUser.Dislikes++;
                        }
                    }
                }
                else
                {
                    if (reaction.ToLower() != "like" && reaction.ToLower() != "dislike")
                    {
                        return BadRequest("Invalid reaction type");
                    }

                    // Create a new reaction
                    var newReaction = new UserReaction
                    {
                        ReactedUserId = guid,
                        UserId = userId,
                        ReactionType = reaction.ToLower() == "like" ? ReactionType.Like : ReactionType.Dislike
                    };

                    await _userRepository.AddReactionAsync(newReaction);

                    // Increment the appropriate count
                    if (reaction.ToLower() == "like")
                    {
                        targetUser.Likes++;
                    }
                    else
                    {
                        targetUser.Dislikes++;
                    }
                }

                // Save the updated counts
                await _userRepository.UpdateUserProfileAsync(targetUser);

                return Ok("Reaction updated successfully");
            }

            return BadRequest("Invalid user ID");
        }

    }

    public class UpdateProfileRequest
    {
        public string ProfileInfo { get; set; } = string.Empty;
    }
}