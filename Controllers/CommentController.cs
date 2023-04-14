using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlyShare.Contracts;
using OnlyShare.Database;
using OnlyShare.Services.CommandService;
using OnlyShare.Services.QueryService;


namespace OnlyShare.Controllers;

[ApiController]
[Route("api/[controller]")]

public class CommentController: ControllerBase
{
    private readonly ICommentCommandService _commentCommandService;
    private readonly ICommentQuerryService _commentQuerryService;
    private DataContext _context;

    public CommentController(ICommentCommandService commentCommandService, ICommentQuerryService commentQuerryService, DataContext context)
    {
        _context = context;
        _commentCommandService = commentCommandService;
        _commentQuerryService = commentQuerryService;
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
}