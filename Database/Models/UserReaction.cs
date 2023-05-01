using System;

namespace OnlyShare.Database.Models
{
    public class UserReaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TargetUserId { get; set; }
        public bool IsLike { get; set; }
    }
}
