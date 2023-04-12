using OnlyShare.Contracts;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using OnlyShare.Services.QueryService;

namespace OnlyShare.Services.QueryService
{
    public class QuestionQueryService : IQuestionQueryService
    {
        private readonly ILogger<QuestionQueryService> _logger;
        private readonly IQuestionRepository _questionRepository;

        public QuestionQueryService(ILogger<QuestionQueryService> logger, IQuestionRepository questionRepository)
        {
            _logger = logger;
            _questionRepository = questionRepository;
        }

        public async Task<List<GetQuestionResponse>> GetAllQuestionsAsync()
        {
            var questions = await _questionRepository.GetAllQuestionsAsync();
            var responses = questions.OrderByDescending(question => question.CreatedAt).Select(question => new GetQuestionResponse()
            {
                Id = question.Id,
                Title = question.Title,
                Description = question.Description,
                CreatedAt = question.CreatedAt,
                CreatedByUserName = question.CreatedBy?.Username
            }).ToList();

            return responses;
        }
    }
}
