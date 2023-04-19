using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public interface IQuestionRepository
{
    public Task<Question> AddQuestionAsync(Question? request);
    public Task<IEnumerable<Question>> GetAllQuestionsAsync();
    public Task<IEnumerable<Question>> GetAllQuestionsByUserAsync(Guid userId);
    public Task<Question?> GetQuestionAsync(Guid id);
    public Task EditQuestionAsync(Question question);
    public Task<IEnumerable<Question>> GetQuestionsBySearchTermAsync(string searchTerm);
}