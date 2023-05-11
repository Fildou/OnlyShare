namespace OnlyShare.Contracts;

public class GetCommentResponse
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Content { get; set; }

    public Guid UserId { get; set; }

    public string? CreatedByUser { get; set; }

    public Guid QuestionId { get; set; }

    public int Likes { get; set; }

    public int Dislikes { get; set; }
}