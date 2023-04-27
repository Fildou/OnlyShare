using OnlyShare.Contracts;
using OnlyShare.Database.Models;

namespace OnlyShare.Services.CommandService;

public interface IQuestionCommandService
{
    public Task<AddQuestionResponse> AddQuestionAsync(AddQuestionRequest request, Guid userId);
    public Task DeleteQuestionAsync(DeleteQuestionRequest request, Guid userId);
    public Task EditQuestionAsync(EditQuestionRequest request, Guid questionId, Guid userId);
}