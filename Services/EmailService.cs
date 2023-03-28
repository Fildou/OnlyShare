using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using OnlyShare.Database.Models;

namespace OnlyShare.Services
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetInstructions(string email, string resetToken);
    }

    public class EmailService : IEmailService
    {
        public async Task<bool> SendPasswordResetInstructions(string email, string resetToken)
        {
            // Vytvorte správu
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("OnlyShare", "onlyshare39@gmail.com"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Password Reset Instructions";

            message.Body = new TextPart("plain")
            {
                Text = $"To reset your password, please click on the following link: https://cngroup-utb--2023-os-amundsen.azurewebsites.net/reset-password?token={resetToken}"
            };

            // Nastavte údaje pre pripojenie k serveru SMTP
            using var client = new SmtpClient();
            await client.ConnectAsync("in-v3.mailjet.com", 587, false); // Mailjet SMTP server
            await client.AuthenticateAsync("1db92ca7769fc2beaaaebf4094aa1ffb", "4eefe49a666be517726441ceb305c9e8"); // Mailjet API Key a Secret Key
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
    }
}