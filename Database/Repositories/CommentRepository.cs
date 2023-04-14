using Microsoft.EntityFrameworkCore;
using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public class CommentRepository: ICommentRepository
{
    private readonly ILogger<CommentRepository> _logger;
    private readonly DataContext _context;

    public CommentRepository(ILogger<CommentRepository> logger, DataContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task<Comment> AddCommentAsync(Comment? newComment)
    {
        if(newComment == null)
        {
            _logger.LogError("newComment cant be null");
            throw new ArgumentNullException(nameof(newComment));
        }

        _context.Comments!.Add(newComment);
        await _context.SaveChangesAsync();

        return newComment;
    }

    public async Task<IEnumerable<Comment>> GetAllCommentsAsync()
    {
        return await _context.Comments.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }
}