namespace OnlyShare.Contracts;

public class DeleteQuestionRequest
{
    public required Guid QuestionId { get; init; }
}