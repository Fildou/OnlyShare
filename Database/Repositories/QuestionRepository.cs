using Microsoft.EntityFrameworkCore;
using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public class QuestionRepository: IQuestionRepository
{
    private readonly ILogger<QuestionRepository> _logger;
    private readonly DataContext _context;

    public QuestionRepository(ILogger<QuestionRepository> logger, DataContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<Question> AddQuestionAsync(Question? newQuestion)
    {
        if (newQuestion == null)
        {
            _logger.LogError("newQuestion cant be null");
            throw new ArgumentNullException(nameof(newQuestion));
        }

        _context.Questions!.Add(newQuestion);
        await _context.SaveChangesAsync();

        return newQuestion;
    }
    
    public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
    {
        return await _context.Questions.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }
}