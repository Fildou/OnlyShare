using OnlyShare.Contracts;
using OnlyShare.Database.Models;

namespace OnlyShare.Services.QueryService;

public interface ICommentQuerryService
{
    public Task<List<GetCommentResponse>> GetAllCommentsAsync();
}