namespace OnlyShare.Contracts;

public class AddCommentResponse
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Content { get; set; }

    public string? CreatedByUser { get; set; }

    public Guid QuestionId { get; set; }
}