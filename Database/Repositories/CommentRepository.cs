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

    public async Task<Comment> GetCommentAsync(Guid commentId)
    {
        return await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
    }

    public async Task UpdateCommentAsync(Comment comment)
    {
        _context.Entry(comment).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task<CommentReaction> GetCommentReactionAsync(Guid userId, Guid commentId)
    {
        return await _context.CommentReactions
            .FirstOrDefaultAsync(r => r.UserId == userId && r.CommentId == commentId);
    }

    public async Task AddCommentReactionAsync(CommentReaction reaction)
    {
        _context.CommentReactions.Add(reaction);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCommentReactionAsync(CommentReaction reaction)
    {
        _context.Entry(reaction).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCommentReactionAsync(CommentReaction reaction)
    {
        _context.CommentReactions.Remove(reaction);
        await _context.SaveChangesAsync();
    }
}