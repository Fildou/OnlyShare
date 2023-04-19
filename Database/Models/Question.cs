namespace OnlyShare.Database.Models;

public class Question
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid CreatedById { get; set; }
    public User? CreatedBy { get; set; }
}