using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Users;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public UsersController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] string? roleName, // Changed from int? roleId
            [FromQuery] int? facultyId,
            [FromQuery] bool? status)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Faculty)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.Username.Contains(keyword) || u.FullName.Contains(keyword) || u.Email.Contains(keyword));
            }
            if (!string.IsNullOrEmpty(roleName) && roleName != "All")
            {
                query = query.Where(u => u.Role.RoleName == roleName);
            }
            if (facultyId.HasValue)
            {
                query = query.Where(u => u.FacultyId == facultyId);
            }
            if (status.HasValue)
            {
                query = query.Where(u => u.Status == status);
            }

            var users = await query
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Status = u.Status,
                    RoleName = u.Role.RoleName,
                    FacultyName = u.Faculty != null ? u.Faculty.FacultyName : "N/A",
                    RoleId = u.RoleId,          
                    FacultyId = u.FacultyId
                }).ToListAsync();

            return Ok(users);
        }

        // 1.1 Export Excel (CSV)
        [HttpGet("export")]
        public async Task<IActionResult> Export(
            [FromQuery] string? keyword,
            [FromQuery] string? roleName,
            [FromQuery] int? facultyId,
            [FromQuery] bool? status)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Include(u => u.Faculty)
                .AsQueryable();

            // Apply Filters (Duplicated logic for simplicity, could be refactored)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.Username.Contains(keyword) || u.FullName.Contains(keyword) || u.Email.Contains(keyword));
            }
            if (!string.IsNullOrEmpty(roleName) && roleName != "All") query = query.Where(u => u.Role.RoleName == roleName);
            if (facultyId.HasValue) query = query.Where(u => u.FacultyId == facultyId);
            if (status.HasValue) query = query.Where(u => u.Status == status);

            var users = await query.ToListAsync();

            var sb = new System.Text.StringBuilder();
            sb.AppendLine("ID,Username,Full Name,Email,Phone,Role,Faculty,Status,Created At");

            foreach (var u in users)
            {
                var statusStr = (u.Status == true) ? "Active" : "Locked";
                var email = u.Email ?? "";
                var phone = u.Phone ?? "";
                var roleNameStr = u.Role?.RoleName ?? "N/A";
                var facultyName = u.Faculty?.FacultyName ?? "N/A";
                sb.AppendLine($"{u.UserId},\"{u.Username}\",\"{u.FullName}\",\"{email}\",\"{phone}\",\"{roleNameStr}\",\"{facultyName}\",{statusStr},{u.CreatedAt}");
            }

            return File(System.Text.Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", $"users_export_{DateTime.Now:yyyyMMddHHmmss}.csv");
        }

        // 2. Xem chi tiết 1 User
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var u = await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Faculty)
                .FirstOrDefaultAsync(x => x.UserId == id);

            if (u == null) return NotFound(new { message = "Không tìm thấy user" });

            var userDto = new UserDto
            {
                UserId = u.UserId,
                Username = u.Username,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Status = u.Status,
                RoleName = u.Role.RoleName,
                FacultyName = u.Faculty != null ? u.Faculty.FacultyName : "N/A",
                RoleId = u.RoleId,          
    FacultyId = u.FacultyId,    
            };

            return Ok(userDto);
        }

        // 3. Tạo User mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
        {
            // Check trùng username
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại!" });

            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), // Đã mã hóa
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                RoleId = request.RoleId,
                FacultyId = request.FacultyId,
                Status = true,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tạo tài khoản thành công!", userId = newUser.UserId });
        }

        // 4. Cập nhật User
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy user" });

            user.FullName = request.FullName;
            user.Email = request.Email;
            user.Phone = request.Phone;
            user.RoleId = request.RoleId;
            user.FacultyId = request.FacultyId;
            user.Status = request.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thông tin thành công!" });
        }

        // 5. Xóa User
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy user" });

            // Có thể chọn Xóa mềm (Status = false) hoặc Xóa cứng
            // Ở đây ta xóa cứng luôn:
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa tài khoản thành công!" });
        }
    }
}