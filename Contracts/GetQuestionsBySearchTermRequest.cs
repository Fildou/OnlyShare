using FluentValidation;

namespace OnlyShare.Contracts;

public class GetQuestionsBySearchTermRequest
{
    public required string SearchTerm { get; set; }
}

public class GetQuestionsBySearchTermRequestValidator : AbstractValidator<GetQuestionsBySearchTermRequest>
{
    public GetQuestionsBySearchTermRequestValidator()
    {
        RuleFor(x => x.SearchTerm)
            .NotEmpty()
            .MinimumLength(3)
            .WithMessage("Search term must contain at least 3 characters.");
    }
}