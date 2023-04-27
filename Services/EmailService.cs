using MailKit.Net.Smtp;
using MimeKit;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace OnlyShare.Services
{
    public class EmailService : IEmailService
    {
        private readonly AppSettings _appSettings;

        public EmailService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public async Task<bool> SendPasswordResetInstructions(string email, string resetToken)
        {
            // Vytvorte správu
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("OnlyShare", "onlyshare39@gmail.com"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Password Reset Instructions";

            message.Body = new TextPart("plain")
            {
                Text = string.Format(_appSettings.PasswordResetLink, resetToken, email)
            };

            // Nastavte údaje pre pripojenie k serveru SMTP
            using var client = new SmtpClient();
            await client.ConnectAsync("in-v3.mailjet.com", 587, false); // Mailjet SMTP server
            await client.AuthenticateAsync("1db92ca7769fc2beaaaebf4094aa1ffb", "4eefe49a666be517726441ceb305c9e8"); // Mailjet API Key a Secret Key
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }

        public async Task<bool> SendWelcomeEmail(string email, string username)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("OnlyShare", "onlyshare39@gmail.com"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Welcome to OnlyShare";

            message.Body = new TextPart("plain")
            {
                Text = $"Hello {username},\n\nWelcome to OnlyShare! We're glad to have you onboard.\n\nBest regards,\nThe OnlyShare Team"
            };

            using var client = new SmtpClient();
            await client.ConnectAsync("in-v3.mailjet.com", 587, false);
            await client.AuthenticateAsync("1db92ca7769fc2beaaaebf4094aa1ffb", "4eefe49a666be517726441ceb305c9e8");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
    }
}
