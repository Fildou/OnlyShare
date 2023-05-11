namespace OnlyShare.Database.Models;

public class Comment
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Content { get; set; }

    public User CreatedBy { get; set; }

    public Guid UserId { get; set; }

    public Question Question { get; set; }

    public Guid QuestionId { get; set; }

    public int Likes { get; set; }

    public int Dislikes { get; set; }
}