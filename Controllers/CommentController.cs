using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlyShare.Contracts;
using OnlyShare.Database;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using OnlyShare.Services.CommandService;
using OnlyShare.Services.QueryService;


namespace OnlyShare.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CommentController : ControllerBase
{
    private readonly ICommentCommandService _commentCommandService;
    private readonly ICommentQuerryService _commentQuerryService;
    private readonly ICommentRepository _commentRepository;
    private DataContext _context;

    public CommentController(ICommentCommandService commentCommandService, ICommentQuerryService commentQuerryService, ICommentRepository commentRepository, DataContext context)
    {
        _context = context;
        _commentCommandService = commentCommandService;
        _commentQuerryService = commentQuerryService;
        _commentRepository = commentRepository;
    }

    [HttpPost("[action]")]
    public async Task<ActionResult<AddCommentResponse>> AddComment(AddCommentRequest request)
    {
        string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var handler = new JwtSecurityTokenHandler();
        var userId = handler.ReadJwtToken(token).Claims.FirstOrDefault(c => c.Type == "id")?.Value;

        var validator = new AddCommentRequestValidator();
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        if (userId != null) return Ok(await _commentCommandService.AddCommentAsync(request, Guid.Parse(userId)));
        return BadRequest("userId or questionId is null");
    }

    [HttpGet]
    public async Task<ActionResult<List<GetCommentResponse>>> GetComments()
    {
        var responses = await _commentQuerryService.GetAllCommentsAsync();
        return Ok(responses);
    }

    [HttpPost("AddCommentReaction/{commentId}/{reaction}")]
    public async Task<ActionResult> AddCommentReaction(Guid commentId, string reaction)
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
            var targetComment = await _commentRepository.GetCommentAsync(commentId);
            if (targetComment == null)
            {
                return NotFound("Comment not found");
            }

            // Check if a reaction between these users already exists
            var existingReaction = await _commentRepository.GetCommentReactionAsync(guid, commentId);

            // Update or create a reaction
            if (existingReaction != null)
            {
                // If the existing reaction type is the same as the new one, remove the reaction
                if (existingReaction.ReactionType.ToString().ToLower() == reaction.ToLower())
                {
                    await _commentRepository.DeleteCommentReactionAsync(existingReaction);

                    // Decrement the appropriate count
                    if (reaction.ToLower() == "like")
                    {
                        targetComment.Likes--;
                    }
                    else
                    {
                        targetComment.Dislikes--;
                    }
                }
                else
                {
                    // Otherwise, update the reaction
                    existingReaction.ReactionType = reaction.ToLower() == "like" ? ReactionType.Like : ReactionType.Dislike;
                    await _commentRepository.UpdateCommentReactionAsync(existingReaction);

                    // Update the appropriate counts
                    if (reaction.ToLower() == "like")
                    {
                        targetComment.Likes++;
                        targetComment.Dislikes--;
                    }
                    else
                    {
                        targetComment.Likes--;
                        targetComment.Dislikes++;
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
                var newReaction = new CommentReaction
                {
                    ReactedUserId = guid,
                    CommentId = commentId,
                    ReactionType = reaction.ToLower() == "like" ? ReactionType.Like : ReactionType.Dislike
                };

                await _commentRepository.AddCommentReactionAsync(newReaction);

                // Increment the appropriate count
                if (reaction.ToLower() == "like")
                {
                    targetComment.Likes++;
                }
                else
                {
                    targetComment.Dislikes++;
                }
            }

            // Save the updated counts
            await _commentRepository.UpdateCommentAsync(targetComment);

            // Return the updated comment with the current user's reaction
            var updatedComment = await _commentRepository.GetCommentReactionAsync(commentId, guid);
            return Ok(updatedComment);
        }

        return BadRequest("Invalid user ID");
    }
}