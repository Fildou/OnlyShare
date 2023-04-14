using OnlyShare.Contracts;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using OnlyShare.Services.QueryService;

namespace OnlyShare.Services.QueryService
{
    public class CommentQuerryService: ICommentQuerryService
    {
        private readonly ILogger<CommentQuerryService> _logger;
        private readonly ICommentRepository _commentRepository;

        public CommentQuerryService(ILogger<CommentQuerryService> logger, ICommentRepository commentRepository)
        {
            _logger = logger;
            _commentRepository = commentRepository;
        }

        public async Task<List<GetCommentResponse>> GetAllCommentsAsync()
        {
            var comments = await _commentRepository.GetAllCommentsAsync();
            var responses = comments.OrderByDescending(comment => comment.CreatedAt).Select(comment => new GetCommentResponse()
            {
                Id = comment.Id,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                CreatedByUser = comment.CreatedBy?.Username,
                QuestionId = comment.QuestionId
            }).ToList();

            return responses;
        }
    }
}