using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public DashboardController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = GetCurrentUserId();
            var role = GetUserRole();
            var facultyId = GetUserFacultyId();

            // 1. Thống kê bài viết
            var postQuery = _context.Posts.AsQueryable();
            if (role == "Teacher")
            {
                postQuery = postQuery.Where(p => p.AuthorId == userId);
            }
            else if (role == "FacultyAdmin")
            {
                postQuery = postQuery.Where(p => p.FacultyId == facultyId);
            }

            var totalPosts = await postQuery.CountAsync();
            var pendingPosts = await postQuery.CountAsync(p => p.Status == "Pending");
            var publishedPosts = await postQuery.CountAsync(p => p.Status == "Published");

            // 2. Thống kê người dùng (Chỉ Admin mới thấy)
            int totalUsers = 0;
            if (role == "Admin")
            {
                totalUsers = await _context.Users.CountAsync();
            }

            // 3. Lấy 5 bài viết gần đây nhất (chế độ chờ duyệt)
            var recentPending = await postQuery
                .Where(p => p.Status == "Pending")
                .Include(p => p.Author)
                .OrderByDescending(p => p.CreatedAt)
                .Take(4)
                .Select(p => new {
                    p.PostId,
                    p.Title,
                    AuthorName = p.Author.FullName,
                    p.Thumbnail,
                    p.CreatedAt,
                    p.Status
                })
                .ToListAsync();

            return Ok(new
            {
                TotalPosts = totalPosts,
                PendingCount = pendingPosts,
                PublishedCount = publishedPosts,
                TotalUsers = totalUsers,
                RecentPending = recentPending
            });
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        private string GetUserRole() => User.FindFirst(ClaimTypes.Role)?.Value ?? "Guest";
        
        private int? GetUserFacultyId()
        {
            var claim = User.FindFirst("FacultyId");
            return (claim != null && !string.IsNullOrEmpty(claim.Value)) ? int.Parse(claim.Value) : null;
        }
    }
}
