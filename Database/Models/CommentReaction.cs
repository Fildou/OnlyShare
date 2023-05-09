namespace OnlyShare.Database.Models
{
    public class CommentReaction
    {
        public Guid Id { get; set; }

        public Guid ReactedUserId { get; set; }

        public Guid CommentId { get; set; }

        public ReactionType ReactionType { get; set; }

        public Comment Comment { get; set; }

        public User User { get; set; }
    }
}
