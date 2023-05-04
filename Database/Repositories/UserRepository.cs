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

        public async Task<UserReaction?> GetReactionAsync(Guid reactingUserId, Guid targetUserId)
        {
            return await _context.UserReactions.FirstOrDefaultAsync(
                ur => ur.ReactedUserId == reactingUserId && ur.UserId == targetUserId);
        }

        public async Task AddReactionAsync(UserReaction reaction)
        {
            await _context.UserReactions.AddAsync(reaction);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReactionAsync(UserReaction reaction)
        {
            _context.UserReactions.Update(reaction);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteReactionAsync(UserReaction reaction)
        {
            _context.UserReactions.Remove(reaction);
            await _context.SaveChangesAsync();
        }
    }
}
