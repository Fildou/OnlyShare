using System.IdentityModel.Tokens.Jwt;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlyShare.Contracts;
using OnlyShare.Services.CommandService;
using OnlyShare.Services.QueryService;


namespace OnlyShare.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly IQuestionCommandService _questionCommandService;
    private readonly IQuestionQueryService _questionQueryService;
    
    public QuestionsController(IQuestionCommandService questionCommandService, IQuestionQueryService questionQueryService)
    {
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

    [HttpGet("[action]")]
    public async Task<ActionResult<List<GetQuestionResponse>>> GetQuestions([FromQuery] string? searchTerm = null)
    {
        if (searchTerm.IsNullOrEmpty())
        {
            var responses = await _questionQueryService.GetAllQuestionsAsync();
            return Ok(responses);
        }

        var validator = new GetQuestionsBySearchTermRequestValidator();
        var validationResult = await validator.ValidateAsync(new GetQuestionsBySearchTermRequest() { SearchTerm = searchTerm });

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var response = await _questionQueryService.GetQuestionsBySearchTermAsync(new GetQuestionsBySearchTermRequest() { SearchTerm = searchTerm });

        return Ok(response);
    }

    [HttpGet("[action]")]
    public async Task<ActionResult<List<GetQuestionResponse>>> GetQuestionsByUserId()
    {
        string token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        var handler = new JwtSecurityTokenHandler();
        var userId = handler.ReadJwtToken(token).Claims.FirstOrDefault(c => c.Type == "id")?.Value;

        if (userId == null)
        {
            return Ok("Nemate ziadne otazky");
        }
        
        var id = Guid.Parse(userId);
        var responses = await _questionQueryService.GetAllQuestionsByUserAsync(id);
        return Ok(responses);
    }
}