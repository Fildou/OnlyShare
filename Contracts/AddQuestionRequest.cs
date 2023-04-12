using FluentValidation;
namespace OnlyShare.Contracts;

public class AddQuestionRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
}

public class AddQuestionRequestValidator : AbstractValidator<AddQuestionRequest>
{
    public AddQuestionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title must be less than or equal to 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description must be less than or equal to 500 characters.");
    }
}