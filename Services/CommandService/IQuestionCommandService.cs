using OnlyShare.Contracts;

namespace OnlyShare.Services.CommandService;

public interface IQuestionCommandService
{
    public Task<AddQuestionResponse> AddQuestionAsync(AddQuestionRequest request, Guid userId);
}