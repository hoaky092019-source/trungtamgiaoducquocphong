using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;
        private readonly IConfiguration _configuration; // Để đọc key từ appsettings

        public AuthController(TrungtamgiaoducquocphongContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin!" });
            }

            // 1. Tìm User + Role + Faculty
            // 1. Tìm User
            var user = await _context.Users
                .Include(u => u.Role)
                    .ThenInclude(r => r.Permissions) // Load Permissions
                .Include(u => u.Faculty) // JOIN thêm bảng Faculty
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng!" });
            }

            // --- HYBRID LOGIN LOGIC (Để hỗ trợ cả password cũ và mới) ---
            bool isPasswordValid = false;
            bool needsUpgrade = false;

            // A. Thử kiểm tra theo kiểu Hash (BCrypt)
            try
            {
                // Chỉ verify nếu giống format hash ($2a$...)
                if (user.PasswordHash.StartsWith("$2") && BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    isPasswordValid = true;
                }
            }
            catch 
            {
                // Lỗi format -> Không phải hash -> Bỏ qua
            }

            // B. Nếu Hash thất bại -> Check kiểu cũ (Plain text)
            if (!isPasswordValid)
            {
                if (user.PasswordHash == request.Password)
                {
                    isPasswordValid = true;
                    needsUpgrade = true; // Đánh dấu để nâng cấp
                }
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng!" });
            }

            // C. Tự động nâng cấp mật khẩu nếu đang dùng plain text
            if (needsUpgrade)
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                await _context.SaveChangesAsync();
            }
            // -----------------------------------------------------------

            if (user.Status == false)
            {
                return Unauthorized(new { message = "Tài khoản đã bị khóa!" });
            }

            // 2. Tạo Token JWT
            var token = GenerateJwtToken(user);

            // 3. Chuẩn bị response
            var response = new LoginResponse
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                RoleName = user.Role?.RoleName ?? "Guest",
                FacultyName = user.Faculty?.FacultyName ?? "Toàn trường", // Lấy tên khoa
                FacultyId = user.FacultyId,
                Avatar = "https://placehold.co/100x100", 
                Token = token,
                Permissions = user.Role?.Permissions.Select(p => p.PermissionName).ToList() ?? new List<string>()
            };

            return Ok(new { message = "Đăng nhập thành công!", data = response });
        }

        // --- HÀM TẠO TOKEN ---
        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            // Nhét thông tin vào Token (Claims)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "Guest"),
                
                // Custom Claims: Nhét thêm Khoa vào Token
                new Claim("FacultyId", user.FacultyId?.ToString() ?? ""),
                new Claim("FacultyName", user.Faculty?.FacultyName ?? "Toàn trường")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(3), // Token sống 3 giờ
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}