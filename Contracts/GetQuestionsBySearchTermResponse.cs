namespace OnlyShare.Contracts;

public class GetQuestionsBySearchTermResponse
{
    public required List<GetQuestionResponse>? Questions { get; init; }
}