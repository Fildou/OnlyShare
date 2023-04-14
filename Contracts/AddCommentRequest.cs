using FluentValidation;
namespace OnlyShare.Contracts;

public class AddCommentRequest
{
    public string? Content { get; set; }

    public string? Question { get; set; }
}

public class AddCommentRequestValidator: AbstractValidator<AddCommentRequest>
{
    public AddCommentRequestValidator()
    {
        RuleFor(x => x.Content)
        .NotEmpty().WithMessage("Comment content is required")
        .MaximumLength(1000).WithMessage("Comment content must be less than or equal to 1000 characters.");

        RuleFor(x => x.Question)
        .NotEmpty().WithMessage("Question is required");
    }
}