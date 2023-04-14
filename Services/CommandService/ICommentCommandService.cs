using OnlyShare.Contracts;

namespace OnlyShare.Services.CommandService;

public interface ICommentCommandService
{
    public Task<AddCommentResponse> AddCommentAsync(AddCommentRequest request, Guid userId);
}