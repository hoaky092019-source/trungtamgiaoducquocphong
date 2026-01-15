using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Categories;
using System.Text.RegularExpressions;
using System.Text;
using backend.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public CategoriesController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) throw new UnauthorizedAccessException("User ID claim not found in token.");
            return int.Parse(claim.Value);
        }

        // Helper: Hàm tạo Slug không dấu (Có thể tách ra Utils riêng)
        private string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            // Xóa dấu tiếng Việt
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

        // 1. Lấy danh sách danh mục (Có tìm kiếm)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword)
        {
            var query = _context.Categories
                .Include(c => c.ParentCategory)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(c => c.CategoryName.Contains(keyword) || c.Description.Contains(keyword));
            }

            var list = await query
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new CategoryDto { 
                    CategoryId = c.CategoryId, 
                    CategoryName = c.CategoryName, 
                    Slug = c.Slug,
                    Description = c.Description,
                    CreatedAt = c.CreatedAt,
                    ParentCategoryId = c.ParentCategoryId,
                    ParentCategoryName = c.ParentCategory != null ? c.ParentCategory.CategoryName : "--- Gốc ---"
                }).ToListAsync();
            return Ok(list);
        }

        // 1.1 Export Categories (CSV)
        [HttpGet("export")]
        [Authorize]
        public async Task<IActionResult> Export([FromQuery] string? keyword)
        {
            var query = _context.Categories.Include(c => c.ParentCategory).AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(c => c.CategoryName.Contains(keyword) || c.Description.Contains(keyword));
            }

            var list = await query.OrderBy(c => c.CategoryName).ToListAsync();
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("ID,Category Name,Slug,Parent Category,Description,Created At");

            foreach (var c in list)
            {
                var parent = c.ParentCategory != null ? c.ParentCategory.CategoryName : "";
                var description = c.Description ?? "";
                var slug = c.Slug ?? "";
                sb.AppendLine($"{c.CategoryId},\"{c.CategoryName}\",\"{slug}\",\"{parent}\",\"{description}\",{c.CreatedAt}");
            }

            return File(System.Text.Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", $"categories_export_{DateTime.Now:yyyyMMddHHmmss}.csv");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _context.Categories.FindAsync(id);
            if (c == null) return NotFound(new { message = "Không tìm thấy danh mục" });
            
            return Ok(new CategoryDto { 
                CategoryId = c.CategoryId, 
                CategoryName = c.CategoryName, 
                Slug = c.Slug,
                Description = c.Description,
                ParentCategoryId = c.ParentCategoryId, // Trả về để bind vào dropdown
                CreatedAt = c.CreatedAt
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateUpdateCategoryRequest request)
        {
            var category = new Category { 
                CategoryName = request.CategoryName, 
                Description = request.Description,
                ParentCategoryId = request.ParentCategoryId, // Lưu cha
                Slug = GenerateSlug(request.CategoryName),   // Tự sinh slug
                CreatedAt = DateTime.Now
            };
            
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm danh mục thành công" });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateCategoryRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = "Không tìm thấy" });

            // Chặn đệ quy vô tận: Không chọn chính mình làm cha
            if (request.ParentCategoryId == id) 
                return BadRequest(new { message = "Không thể chọn chính danh mục này làm cha!" });

            category.CategoryName = request.CategoryName;
            category.Description = request.Description;
            category.ParentCategoryId = request.ParentCategoryId;
            category.Slug = GenerateSlug(request.CategoryName); // Cập nhật lại slug nếu đổi tên

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound(new { message = "Không tìm thấy" });
            
            // Logic an toàn: Nếu danh mục này đang là Cha của danh mục khác -> Không cho xóa
            bool isParent = await _context.Categories.AnyAsync(c => c.ParentCategoryId == id);
            if (isParent) return BadRequest(new { message = "Danh mục này đang chứa danh mục con, hãy xóa con trước!" });

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Xóa danh mục thành công" });
        }
    }
}