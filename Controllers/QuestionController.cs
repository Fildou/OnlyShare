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
public class QuestionsController : ControllerBase
{
    private readonly IQuestionCommandService _questionCommandService;
    private readonly IQuestionQueryService _questionQueryService;
    private DataContext _context;
    
    public QuestionsController(IQuestionCommandService questionCommandService, IQuestionQueryService questionQueryService, DataContext context)
    {
        _context = context;
        _questionCommandService = questionCommandService;
        _questionQueryService = questionQueryService;
    }

    
    [HttpPost("[action]")]
    public async Task<ActionResult<AddQuestionResponse>> AddQuestion(AddQuestionRequest request)
    {
        //var userId = Guid.Parse(User.FindFirstValue("id")!);

        string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var handler = new JwtSecurityTokenHandler();
        var userId = handler.ReadJwtToken(token).Claims.FirstOrDefault(c => c.Type == "id")?.Value;


        var validator = new AddQuestionRequestValidator();
        var validationResult = await validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        if (userId != null) return Ok(await _questionCommandService.AddQuestionAsync(request, Guid.Parse(userId)));
        return BadRequest("userId is null");
    }

    [HttpGet]
    public async Task<ActionResult<List<GetQuestionResponse>>> GetQuestions()
    {
        var responses = await _questionQueryService.GetAllQuestionsAsync();
        return Ok(responses);
    }
    
}