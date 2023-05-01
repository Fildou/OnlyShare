using Microsoft.EntityFrameworkCore;
using OnlyShare.Database.Models;

namespace OnlyShare.Database.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            this._context = context;
        }

        public async Task<User?> GetUserAsync(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(user => user.Id == id);
        }

        public async Task<bool> CheckUserExistsAsync(Guid id)
        {
            return await _context.Users.AnyAsync(user => user.Id == id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            email = email.ToLowerInvariant();
            return await _context.Users.FirstOrDefaultAsync(user => user.Email == email);
        }

        public async Task UpdateUserProfileAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<UserReaction?> GetUserReactionAsync(Guid userId, Guid targetUserId)
        {
            return await _context.UserReactions.FirstOrDefaultAsync(reaction => reaction.UserId == userId && reaction.TargetUserId == targetUserId);
        }

        public async Task AddOrUpdateUserReactionAsync(UserReaction userReaction)
        {
            var existingReaction = await GetUserReactionAsync(userReaction.UserId, userReaction.TargetUserId);
            if (existingReaction == null)
            {
                _context.UserReactions.Add(userReaction);
            }
            else
            {
                existingReaction.IsLike = userReaction.IsLike;
            }
            await _context.SaveChangesAsync();
        }

        public async Task RemoveUserReactionAsync(UserReaction userReaction)
        {
            _context.UserReactions.Remove(userReaction);
            await _context.SaveChangesAsync();
        }

    }
}
