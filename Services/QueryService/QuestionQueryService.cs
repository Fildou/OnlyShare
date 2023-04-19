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

        public async Task<GetQuestionResponse> GetQuestionByIdAsync(Guid id)
        {
            var question = await _questionRepository.GetQuestionAsync(id);

            if (question == null)
            {
                _logger.LogError("question cant be null");
                throw new ArgumentNullException(nameof(question));
            }

            return new GetQuestionResponse
            {
                Id = question.Id,
                Title = question.Title,
                Description = question.Description,
                CreatedAt = question.CreatedAt,
                CreatedByUserName = question.CreatedBy?.Username
            };
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

        public async Task<List<GetQuestionResponse>> GetAllQuestionsByUserAsync(Guid id)
        {
            var questions = await _questionRepository.GetAllQuestionsByUserAsync(id);
            var responses = questions.OrderByDescending(question => question.CreatedAt).Select(question =>
                new GetQuestionResponse()
                {
                    Id = question.Id,
                    Title = question.Title,
                    Description = question.Description,
                    CreatedAt = question.CreatedAt,
                    CreatedByUserName = question.CreatedBy?.Username
                }).ToList();

            return responses;
        }

        public async Task<GetQuestionsBySearchTermResponse> GetQuestionsBySearchTermAsync(GetQuestionsBySearchTermRequest request)
        {
            var questions = await _questionRepository.GetQuestionsBySearchTermAsync(request.SearchTerm);

            var response = new GetQuestionsBySearchTermResponse
            {
                Questions = questions.Select(question => new GetQuestionResponse()
                {
                    Id = question.Id,
                    Title = question.Title,
                    Description = question.Description,
                    CreatedAt = question.CreatedAt,
                    CreatedByUserName = question.CreatedBy!.Username,
                }).ToList()
            };

            return response;
        }
    }
}
