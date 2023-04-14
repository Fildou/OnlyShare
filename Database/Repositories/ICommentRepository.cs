using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public interface ICommentRepository
{
    public Task<Comment> AddCommentAsync(Comment? request);
    public Task<IEnumerable<Comment>> GetAllCommentsAsync();

}