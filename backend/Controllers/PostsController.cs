using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Posts;
using System.Text.RegularExpressions;
using System.Text;
using backend.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;
        private readonly INotificationService _notificationService;

        public PostsController(TrungtamgiaoducquocphongContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        private string GenerateSlug(string phrase)
        {
            if (string.IsNullOrEmpty(phrase)) return "";
            string str = phrase.ToLower();
            str = Regex.Replace(str, @"[áàạảãâấầậẩẫăắằặẳẵ]", "a");
            str = Regex.Replace(str, @"[éèẹẻẽêếềệểễ]", "e");
            str = Regex.Replace(str, @"[óòọỏõôốồộổỗơớờợởỡ]", "o");
            str = Regex.Replace(str, @"[úùụủũưứừựửữ]", "u");
            str = Regex.Replace(str, @"[íìịỉĩ]", "i");
            str = Regex.Replace(str, @"[đ]", "d");
            str = Regex.Replace(str, @"[ýỳỵỷỹ]", "y");
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", "-").Trim();
            return str;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) return 0;
            return int.Parse(claim.Value);
        }

        private string GetUserRole() => User.FindFirst(ClaimTypes.Role)?.Value ?? "Guest";
        private int? GetUserFacultyId()
        {
            var claim = User.FindFirst("FacultyId");
            return (claim != null && !string.IsNullOrEmpty(claim.Value)) ? int.Parse(claim.Value) : null;
        }

        // 1. Lấy danh sách (Có lọc theo quyền)
        // 1. Lấy danh sách (Có lọc theo quyền & Search)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool isPublic = false,
            [FromQuery] string? keyword = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? status = null)
        {
            var query = _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Faculty)
                .Include(p => p.Author)
                .AsQueryable();

            // Lọc theo từ khóa
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Title.Contains(keyword));
            }

            // Lọc theo danh mục
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId);
            }

            // Lọc theo trạng thái (nếu có truyền lên)
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(p => p.Status == status);
            }

            if (isPublic)
            {
                // Chế độ công khai: Chỉ lấy bài đã xuất bản
                query = query.Where(p => p.Status == "Published");
            }
            else
            {
                // Chế độ quản trị: Yêu cầu Token và lọc theo quyền
                if (User.Identity == null || !User.Identity.IsAuthenticated)
                    return Unauthorized(new { message = "Vui lòng đăng nhập để xem danh sách quản trị" });

                string role = GetUserRole();
                int userId = GetCurrentUserId();
                int? facultyId = GetUserFacultyId();

                if (role == "Teacher")
                {
                    query = query.Where(p => p.AuthorId == userId);
                }
                else if (role == "FacultyAdmin")
                {
                    query = query.Where(p => p.FacultyId == facultyId);
                }
            }

            var list = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new PostDto
                {
                    PostId = p.PostId,
                    Title = p.Title,
                    Thumbnail = p.Thumbnail,
                    Status = p.Status,
                    ViewCount = p.ViewCount,
                    CreatedAt = p.CreatedAt,
                    Slug = p.Slug,
                    Summary = !string.IsNullOrEmpty(p.Content) && p.Content.Length > 100 
                              ? p.Content.Substring(0, 100) + "..." 
                              : p.Content ?? "",
                    CategoryName = p.Category != null ? p.Category.CategoryName : "Chung",
                    FacultyName = p.Faculty != null ? p.Faculty.FacultyName : "Toàn trường",
                    AuthorName = p.Author != null ? p.Author.FullName : "N/A"
                }).ToListAsync();

            return Ok(list);
        }

        // 1.1 Export Posts (CSV)
        [HttpGet("export")]
        [Authorize]
        public async Task<IActionResult> Export(
            [FromQuery] string? keyword = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? status = null)
        {
             var query = _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Faculty)
                .Include(p => p.Author)
                .AsQueryable();

            // Filters
            if (!string.IsNullOrEmpty(keyword)) query = query.Where(p => p.Title.Contains(keyword));
            if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId);
            if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);

            // Role filtering for export (Security)
            string role = GetUserRole();
            int userId = GetCurrentUserId();
            int? facultyId = GetUserFacultyId();

            if (role == "Teacher") query = query.Where(p => p.AuthorId == userId);
            else if (role == "FacultyAdmin") query = query.Where(p => p.FacultyId == facultyId);

            var posts = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();

            var sb = new System.Text.StringBuilder();
            sb.AppendLine("ID,Title,Category,Faculty,Author,Status,Views,Created At");

            foreach (var p in posts)
            {
                // Escape CSV injection or commas
                var title = (p.Title?.Replace("\"", "\"\"")) ?? "";
                var cat = p.Category?.CategoryName ?? "N/A";
                var fac = p.Faculty?.FacultyName ?? "N/A";
                var auth = p.Author?.FullName ?? "N/A";
                var statusStr = p.Status ?? "Draft";
                sb.AppendLine($"{p.PostId},\"{title}\",\"{cat}\",\"{fac}\",\"{auth}\",{statusStr},{p.ViewCount},{p.CreatedAt}");
            }

            return File(System.Text.Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", $"posts_export_{DateTime.Now:yyyyMMddHHmmss}.csv");
        }

        // 2. Lấy chi tiết
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var p = await _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Approver)
                .FirstOrDefaultAsync(x => x.PostId == id);

            if (p == null) return NotFound(new { message = "Không tìm thấy bài viết" });

            return Ok(MapToDto(p));
        }

        // 2.1 Lấy chi tiết theo Slug (Public)
        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var p = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Faculty)
                .Include(p => p.Author)
                .FirstOrDefaultAsync(x => x.Slug == slug && x.Status == "Published");

            if (p == null) return NotFound(new { message = "Không tìm thấy bài viết hoặc bài chưa được duyệt" });

            return Ok(MapToDto(p));
        }

        // 2.2 Lấy danh sách bài viết theo Category Slug (Public - Cha lấy cả con)
        [HttpGet("public/category/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCategorySlug(string slug, [FromQuery] int page = 1, [FromQuery] int limit = 5)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
            if (category == null) return NotFound(new { message = "Không tìm thấy danh mục" });

            var categoryIds = new List<int> { category.CategoryId };
            var childrenIds = await _context.Categories
                .Where(c => c.ParentCategoryId == category.CategoryId)
                .Select(c => c.CategoryId)
                .ToListAsync();
            categoryIds.AddRange(childrenIds);

            var query = _context.Posts
                .Include(p => p.Category)
                .Include(p => p.Author)
                .Where(p => p.CategoryId != null && categoryIds.Contains((int)p.CategoryId) && p.Status == "Published");

            int total = await query.CountAsync();
            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return Ok(new
            {
                data = posts.Select(MapToDto),
                total = total,
                page = page,
                limit = limit,
                totalPages = (int)Math.Ceiling((double)total / limit)
            });
        }



        // 3. Thêm mới
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateUpdatePostRequest request)
        {
            int userId = GetCurrentUserId();
            string role = GetUserRole();

            var post = new Post
            {
                Title = request.Title,
                Content = request.Content,
                Thumbnail = request.Thumbnail,
                CategoryId = request.CategoryId,
                FacultyId = request.FacultyId,
                
                Slug = GenerateSlug(request.Title),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                ViewCount = 0,
                AuthorId = userId 
            };

            // Logic trạng thái dựa trên quyền
            if (role == "Teacher")
            {
                // Teacher chỉ có thể gửi chờ duyệt hoặc lưu nháp
                post.Status = (request.Status == "Pending") ? "Pending" : "Draft";
            }
            else
            {
                post.Status = request.Status;
                if (post.Status == "Published") post.PublishedAt = DateTime.Now;
            }

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Nếu trạng thái là Pending -> Thông báo cho Quản lý
            if (post.Status == "Pending")
            {
                await _notificationService.BroadcastToAdminsAsync("Yêu cầu duyệt bài", $"Giảng viên vừa gửi bài viết: {post.Title}", "info", $"/admin/posts", post.FacultyId);
            }

            return Ok(new { message = "Thao tác thành công", id = post.PostId });
        }

        // 4. Cập nhật
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdatePostRequest request)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound(new { message = "Không tìm thấy bài viết" });

            int userId = GetCurrentUserId();
            string role = GetUserRole();

            // Kiểm tra quyền sửa
            if (role == "Teacher" && post.AuthorId != userId)
                return Forbid();

            post.Title = request.Title;
            post.Content = request.Content;
            post.Thumbnail = request.Thumbnail;
            post.CategoryId = request.CategoryId;
            post.FacultyId = request.FacultyId;
            post.UpdatedAt = DateTime.Now;
            post.Slug = GenerateSlug(request.Title);

            // Cập nhật trạng thái
            if (role == "Teacher")
            {
                // Nếu đang chờ duyệt thì không cho sửa hoặc sẽ về Draft? 
                // Ở đây cho phép sửa và giữ nguyên trạng thái hoặc về Pending nếu yêu cầu
                post.Status = (request.Status == "Pending") ? "Pending" : "Draft";
            }
            else
            {
                post.Status = request.Status;
                if (post.Status == "Published" && post.PublishedAt == null) post.PublishedAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            if (post.Status == "Pending")
            {
                 await _notificationService.BroadcastToAdminsAsync("Yêu cầu duyệt bài (Cập nhật)", $"Bài viết: {post.Title} đã được cập nhật nội dung.", "info", $"/admin/posts", post.FacultyId);
            }

            return Ok(new { message = "Cập nhật thành công" });
        }

        // 5. Xóa
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            int userId = GetCurrentUserId();
            string role = GetUserRole();

            if (role == "Teacher" && post.AuthorId != userId) return Forbid();

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa bài viết" });
        }

        // --- CÁC ENDPOINT PHÊ DUYỆT ---

        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Admin,FacultyAdmin")]
        public async Task<IActionResult> Approve(int id, [FromBody] ApprovalRequest request)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            int userId = GetCurrentUserId();
            
            post.Status = "Published"; // Duyệt là cho public luôn
            post.ApproverId = userId;
            post.PublishedAt = DateTime.Now;
            post.ApprovalComment = request.Comment;

            await _context.SaveChangesAsync();

            // Thông báo cho tác giả
            await _notificationService.CreateNotificationAsync(post.AuthorId, "Bài viết đã được duyệt", $"Bài viết '{post.Title}' đã được phê duyệt và công khai.", "success", $"/admin/posts/edit/{id}");

            return Ok(new { message = "Đã duyệt bài viết thành công" });
        }

        [HttpPost("{id}/reject")]
        [Authorize(Roles = "Admin,FacultyAdmin")]
        public async Task<IActionResult> Reject(int id, [FromBody] ApprovalRequest request)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            int userId = GetCurrentUserId();
            
            post.Status = "Rejected";
            post.ApproverId = userId;
            post.ApprovalComment = request.Comment;

            await _context.SaveChangesAsync();

            // Thông báo cho tác giả
            await _notificationService.CreateNotificationAsync(post.AuthorId, "Bài viết bị từ chối", $"Bài viết '{post.Title}' bị từ chối duyệt. Lý do: {request.Comment}", "warning", $"/admin/posts/edit/{id}");

            return Ok(new { message = "Đã từ chối bài viết" });
        }

        private PostDto MapToDto(Post p)
        {
            return new PostDto
            {
                PostId = p.PostId,
                Title = p.Title,
                Content = p.Content,
                Thumbnail = p.Thumbnail,
                Status = p.Status,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.CategoryName,
                FacultyId = p.FacultyId,
                Slug = p.Slug,
                AuthorName = p.Author?.FullName,
                ApproverName = p.Approver?.FullName,
                ApprovalComment = p.ApprovalComment,
                ViewCount = p.ViewCount,
                CreatedAt = p.CreatedAt
            };
        }
    }
}