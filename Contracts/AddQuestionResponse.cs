namespace OnlyShare.Contracts;

public class AddQuestionResponse
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedByUserName { get; set; }
}