namespace OnlyShare.Database.Models
{
    public class UserReaction
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public Guid ReactedUserId { get; set; }

        public ReactionType ReactionType { get; set; }
    }

    public enum ReactionType
    {
        Like,
        Dislike
    }
}
