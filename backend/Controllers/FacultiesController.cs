using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Faculties;
using backend.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultiesController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public FacultiesController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) throw new UnauthorizedAccessException("User ID claim not found in token.");
            return int.Parse(claim.Value);
        }

        // 1. Lấy danh sách khoa (Có tìm kiếm)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword)
        {
            var query = _context.Faculties.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(f => f.FacultyName.Contains(keyword) || f.Description.Contains(keyword));
            }

            var list = await query
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new FacultyDto
                {
                    FacultyId = f.FacultyId,
                    FacultyName = f.FacultyName,
                    Description = f.Description,
                    CreatedAt = f.CreatedAt
                }).ToListAsync();

            return Ok(list);
        }

        // 1.1 Export Excel (CSV)
        [HttpGet("export")]
        [Authorize]
        public async Task<IActionResult> Export([FromQuery] string? keyword)
        {
            var query = _context.Faculties.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(f => f.FacultyName.Contains(keyword) || f.Description.Contains(keyword));
            }

            var list = await query.OrderBy(f => f.FacultyName).ToListAsync();

            var sb = new System.Text.StringBuilder();
            sb.AppendLine("ID,Faculty Name,Description,Created At");

            foreach (var f in list)
            {
                var description = f.Description ?? "";
                sb.AppendLine($"{f.FacultyId},\"{f.FacultyName}\",\"{description}\",{f.CreatedAt}");
            }

            return File(System.Text.Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", $"faculties_export_{DateTime.Now:yyyyMMddHHmmss}.csv");
        }

        // 2. Thêm khoa mới
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateUpdateFacultyRequest request)
        {
            var newFaculty = new Faculty
            {
                FacultyName = request.FacultyName,
                Description = request.Description,
                CreatedAt = DateTime.Now
            };

            _context.Faculties.Add(newFaculty);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm khoa thành công!", id = newFaculty.FacultyId });
        }

        // 3. Sửa khoa
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateFacultyRequest request)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null) return NotFound(new { message = "Không tìm thấy khoa!" });

            faculty.FacultyName = request.FacultyName;
            faculty.Description = request.Description;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công!" });
        }

        // 4. Xóa khoa
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null) return NotFound(new { message = "Không tìm thấy khoa!" });

            // Kiểm tra: Nếu khoa đang có User hoặc Document thì không cho xóa (tránh lỗi khóa ngoại)
            bool hasUsers = await _context.Users.AnyAsync(u => u.FacultyId == id);
            if (hasUsers) return BadRequest(new { message = "Khoa này đang có nhân sự, không thể xóa!" });

            _context.Faculties.Remove(faculty);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "Đã xóa khoa thành công!" });
        }
        // 5. Lấy chi tiết 1 khoa (GetById)
[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
    var faculty = await _context.Faculties.FindAsync(id);

    if (faculty == null) 
    {
        return NotFound(new { message = "Không tìm thấy khoa!" });
    }

    // Map sang DTO để trả về
    var facultyDto = new FacultyDto
    {
        FacultyId = faculty.FacultyId,
        FacultyName = faculty.FacultyName,
        Description = faculty.Description,
        CreatedAt = faculty.CreatedAt
    };

    return Ok(facultyDto);
}
    }
}