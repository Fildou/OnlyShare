using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories;

public interface IUserRepository
{
    public Task<User?> GetUserAsync(Guid id);
    public Task<bool> CheckUserExistsAsync(Guid id);
    public Task<User?> GetUserByEmailAsync(string email);
    public Task UpdateUserProfileAsync(User user);
    public Task<UserReaction?> GetUserReactionAsync(Guid userId, Guid targetUserId);
    public Task AddOrUpdateUserReactionAsync(UserReaction userReaction);
    public Task RemoveUserReactionAsync(UserReaction userReaction);
}