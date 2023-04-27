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

    public async Task EditQuestionAsync(Question? question)
    {
        if (question == null)
        {
            _logger.LogError("update question cant be null");
            throw new ArgumentNullException(nameof(question));
        }
        
        _context.Questions.Update(question);
        await _context.SaveChangesAsync();
    }
    
    public async Task<Question?> GetQuestionAsync(Guid id)
    {
        return await _context.Questions.FindAsync(id);
    }
    public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
    {
        return await _context.Questions.Include(x => x.CreatedBy).ToListAsync();
    }

    public async Task<IEnumerable<Question>> GetAllQuestionsByUserAsync(Guid userId)
    {
        return await _context.Questions.Include(q => q.CreatedBy).Where(q => q.CreatedById == userId).ToListAsync();
    }
    
    public async Task<IEnumerable<Question>> GetQuestionsBySearchTermAsync(string searchTerm)
    {
        return await _context.Questions
            .Include(question => question.CreatedBy)
            .Where(question => 
                EF.Functions.Collate(question.Title.ToLower(), "Latin1_General_CI_AI").Contains(EF.Functions.Collate(searchTerm.ToLower(), "Latin1_General_CI_AI"))
                || EF.Functions.Collate(question.CreatedBy.Username.ToLower(), "Latin1_General_CI_AI").Contains(EF.Functions.Collate(searchTerm.ToLower(), "Latin1_General_CI_AI")))
            .OrderBy(question => question.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteQuestionAsync(Guid questionId)
    {
        var comments = await _context.Comments.Where(c => c.QuestionId == questionId).ToListAsync();

        foreach (var comment in comments)
        {
            _context.Comments.Remove(comment);
        }
        
        var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == questionId);
        
        if (question == null)
        {
            return;
        }
        
        _context.Questions.Remove(question);

        await _context.SaveChangesAsync();
    }
    
}