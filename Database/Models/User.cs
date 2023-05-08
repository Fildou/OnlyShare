namespace OnlyShare.Database.Models
{
    public class User 
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        public string ProfileInfo { get; set; } = string.Empty;

        public int Likes { get; set; }

        public int Dislikes { get; set; }

    }
}
