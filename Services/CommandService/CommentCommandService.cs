using OnlyShare.Contracts;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;

namespace OnlyShare.Services.CommandService;

public class CommentCommandService: ICommentCommandService
{
    private readonly ILogger<CommentCommandService> _logger;
    private readonly ICommentRepository _commentRepository;

    public CommentCommandService(ILogger<CommentCommandService> logger, ICommentRepository commentRepository)
    {
        _logger = logger;
        _commentRepository = commentRepository;
    }

    public async Task<AddCommentResponse> AddCommentAsync(AddCommentRequest request, Guid userId){
        if (string.IsNullOrWhiteSpace(request.Content))
        {
            _logger.LogError("Content cannot be null or empty.");
            throw new ArgumentNullException(nameof(request.Content));
        }

        var newComment = new Comment()
        {
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            QuestionId = Guid.Parse(request.Question)
        };

        var response = await _commentRepository.AddCommentAsync(newComment);

        return new AddCommentResponse()
        {
            Id = response.Id,
            Content = response.Content,
            CreatedAt = response.CreatedAt,
            CreatedByUser = response.CreatedBy?.Email,
            QuestionId = response.QuestionId
        };
    }
}