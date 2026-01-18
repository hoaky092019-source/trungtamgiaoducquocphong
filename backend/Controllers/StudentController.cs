using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Student;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;
        private readonly IConfiguration _configuration;

        public StudentController(TrungtamgiaoducquocphongContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/student/schools
        [HttpGet("schools")]
        public async Task<IActionResult> GetSchools()
        {
            var schools = await _context.Schools
                .Select(s => new { s.Id, s.Name, s.Code })
                .ToListAsync();
            return Ok(schools);
        }

        // GET: api/student/courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses
                .Where(c => c.IsActive)
                .OrderByDescending(c => c.StartDate)
                .Select(c => new { c.Id, c.Name, c.StartDate, c.EndDate })
                .ToListAsync();
            return Ok(courses);
        }

        // POST: api/student/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] StudentLoginDto request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            var student = await _context.Students
                .Include(s => s.School)
                .Include(s => s.Course)
                .FirstOrDefaultAsync(s => 
                    s.StudentCode == request.StudentCode && 
                    s.SchoolId == request.SchoolId && 
                    s.CourseId == request.CourseId
                );

            if (student == null)
            {
                return Unauthorized(new { message = "Thông tin không chính xác. Vui lòng kiểm tra lại MSSV, Trường và Khóa học." });
            }

            // Generate Token
            var token = GenerateJwtToken(student);

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                token = token,
                student = new
                {
                    student.Id,
                    student.StudentCode,
                    student.FullName,
                    SchoolName = student.School.Name,
                    CourseName = student.Course.Name
                }
            });
        }

        private string GenerateJwtToken(Student student)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
                new Claim(ClaimTypes.Name, student.FullName),
                new Claim("StudentCode", student.StudentCode),
                new Claim(ClaimTypes.Role, "Student"),  // Role riêng cho Student
                new Claim("SchoolId", student.SchoolId.ToString()),
                new Claim("CourseId", student.CourseId.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(3),
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
