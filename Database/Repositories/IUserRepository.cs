using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories
{
    public interface IUserRepository
    {
        public Task<User?> GetUserAsync(Guid id);
        public Task<bool> CheckUserExistsAsync(Guid id);
        public Task<User?> GetUserByEmailAsync(string email);
        public Task UpdateUserProfileAsync(User user);
        public Task<UserReaction?> GetReactionAsync(Guid reactingUserId, Guid targetUserId);
        public Task AddReactionAsync(UserReaction reaction);
        public Task UpdateReactionAsync(UserReaction reaction);
        public Task DeleteReactionAsync(UserReaction reaction);
    }
}
