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
    }
}
