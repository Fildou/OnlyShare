using FluentValidation;

namespace OnlyShare.Contracts;

public class EditQuestionRequest
{
    public required string Title { get; init; }
    public required string Description { get; init; }
}

public class EditQuestionRequestValidator : AbstractValidator<EditQuestionRequest>
{
    public EditQuestionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MinimumLength(3).WithMessage("Title must be at least 3 characters long.")
            .MaximumLength(100).WithMessage("Title must not be longer than 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MinimumLength(3).WithMessage("Description must be at least 10 characters long.")
            .MaximumLength(1000).WithMessage("Description must not be longer than 1000 characters.");
    }
}