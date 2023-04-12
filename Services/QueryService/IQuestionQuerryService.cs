using OnlyShare.Contracts;
using OnlyShare.Database.Models;

namespace OnlyShare.Services.QueryService;

public interface IQuestionQueryService
{ 
    public Task<List<GetQuestionResponse>> GetAllQuestionsAsync();
    
}