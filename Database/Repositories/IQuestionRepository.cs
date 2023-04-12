using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public interface IQuestionRepository
{
    public Task<Question> AddQuestionAsync(Question? request);
    public Task<IEnumerable<Question>> GetAllQuestionsAsync();

}