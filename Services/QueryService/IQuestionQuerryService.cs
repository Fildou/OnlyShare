using OnlyShare.Contracts;
using OnlyShare.Database.Models;

namespace OnlyShare.Services.QueryService;

public interface IQuestionQueryService
{ 
    public Task<List<GetQuestionResponse>> GetAllQuestionsAsync();
    public Task<List<GetQuestionResponse>> GetAllQuestionsByUserAsync(Guid id);
    public Task<GetQuestionResponse> GetQuestionByIdAsync(Guid id);
    public Task<GetQuestionsBySearchTermResponse> GetQuestionsBySearchTermAsync(GetQuestionsBySearchTermRequest request);
}