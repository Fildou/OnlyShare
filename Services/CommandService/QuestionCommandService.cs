﻿using System.Security.Authentication;
using OnlyShare.Contracts;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;

namespace OnlyShare.Services.CommandService;

public class QuestionCommandService : IQuestionCommandService
{
    private readonly ILogger<QuestionCommandService> _logger;
    private readonly IQuestionRepository _questionRepository;
    private readonly IUserRepository _userRepository;

    public QuestionCommandService(ILogger<QuestionCommandService> logger, IQuestionRepository questionRepository, IUserRepository userRepository)
    {
        _logger = logger;
        _questionRepository = questionRepository;
        _userRepository = userRepository;
    }
    
    public async Task<AddQuestionResponse> AddQuestionAsync(AddQuestionRequest request, Guid userId)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
        {
            _logger.LogError("Title cannot be null or empty.");
            throw new ArgumentNullException(nameof(request.Title));
        }

        if (string.IsNullOrWhiteSpace(request.Description))
        {
            _logger.LogError("Description cannot be null or empty.");
            throw new ArgumentNullException(nameof(request.Description));
        }

        if (await _userRepository.CheckUserExistsAsync(userId) == false)
        {
            _logger.LogError("User with ID {UserId} cant be found", userId);
            throw new ArgumentNullException(nameof(userId));
        }
      
        var newQuestion = new Question()
        {
            Title = request.Title,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            CreatedById = userId,
        };
    
        var response = await _questionRepository.AddQuestionAsync(newQuestion);
        var user = _userRepository.GetUserAsync(userId);
        
        return new AddQuestionResponse()
        {
            Id = response.Id,
            Title = response.Title,
            Description = response.Description,
            CreatedAt = response.CreatedAt,
            CreatedByUserName = user.Result?.Username
        };
    }
    
    public async Task DeleteQuestionAsync(DeleteQuestionRequest request, Guid userId)
    {
        if (await _userRepository.CheckUserExistsAsync(userId) == false)
        {
            _logger.LogError("User with ID {UserId} cant be found", userId);
            throw new AuthenticationException("User not found");
        }

        var question = await _questionRepository.GetQuestionAsync(request.QuestionId);

        if (question == null)
        {
            _logger.LogDebug("Question with ID {QuestionId} was not found", request.QuestionId);
            throw new Exception("Question was not found");
        }

        if (question.CreatedById != userId)
        {
            _logger.LogDebug("User {UserId} is not the author of the question", userId);
            throw new Exception("User is not the author of this question");
        }

        await _questionRepository.DeleteQuestionAsync(question.Id);
    }
}