using System.Threading.Tasks;

namespace OnlyShare.Services
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetInstructions(string email, string resetToken);
        Task<bool> SendWelcomeEmail(string email, string username);
    }
}