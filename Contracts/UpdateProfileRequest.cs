namespace OnlyShare.Contracts
{
    public class UpdateProfileRequest
    {
        public string ProfileInfo { get; set; } = string.Empty;

        public IFormFile ProfilePicture { get; set; }
    }
}
