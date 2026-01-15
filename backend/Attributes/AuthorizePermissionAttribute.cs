using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq;

namespace backend.Attributes
{
    public class AuthorizePermissionAttribute : TypeFilterAttribute
    {
        public AuthorizePermissionAttribute(string permission) : base(typeof(AuthorizePermissionFilter))
        {
            Arguments = new object[] { permission };
        }
    }

    public class AuthorizePermissionFilter : IAuthorizationFilter
    {
        private readonly string _permission;
        private readonly TrungtamgiaoducquocphongContext _context;

        public AuthorizePermissionFilter(string permission, TrungtamgiaoducquocphongContext context)
        {
            _permission = permission;
            _context = context;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;
            if (user.Identity == null || !user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                 context.Result = new UnauthorizedResult();
                 return;
            }
            
            // Check explicit permission in DB
            var hasPermission = _context.Users
                .Where(u => u.UserId == userId)
                .SelectMany(u => u.Role.Permissions)
                .Any(p => p.PermissionName == _permission);

            if (!hasPermission)
            {
                context.Result = new ForbidResult();
            }
        }
    }
}
