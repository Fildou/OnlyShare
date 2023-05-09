using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public interface ICommentRepository
{
    public Task<Comment> AddCommentAsync(Comment? request);
    public Task<IEnumerable<Comment>> GetAllCommentsAsync();
    public Task<Comment?> GetCommentAsync(Guid commentId); 
    public Task UpdateCommentAsync(Comment comment); 

    Task<CommentReaction?> GetCommentReactionAsync(Guid userId, Guid commentId);

    Task AddCommentReactionAsync(CommentReaction reaction);

    Task UpdateCommentReactionAsync(CommentReaction reaction);

    Task DeleteCommentReactionAsync(CommentReaction reaction);

}