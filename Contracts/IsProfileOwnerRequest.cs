using Microsoft.AspNetCore.Mvc;

namespace OnlyShare.Contracts
{
    public class IsProfileOwnerRequest
    {
        [FromQuery(Name = "targetUserId")]
        public Guid UserId { get; set; }
    }
}
