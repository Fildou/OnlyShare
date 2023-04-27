using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using OnlyShare.Database.Models;
using OnlyShare.Database.Repositories;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlyShare.Middleware
{
    public class UserContextMiddleware
    {
        private readonly RequestDelegate _next;

        public UserContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
        {
            var userRepository = serviceProvider.GetRequiredService<IUserRepository>();
            if (context.User.Identity.IsAuthenticated)
            {
                var userId = Guid.Parse(context.User.FindFirstValue("id"));
                var user = await userRepository.GetUserAsync(userId);
                if (user != null)
                {
                    context.Items["User"] = user;
                }
            }

            await _next(context);
        }
    }
}
