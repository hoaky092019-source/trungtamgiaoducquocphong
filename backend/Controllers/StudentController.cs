using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Student;
using Microsoft.AspNetCore.Mvc;
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

        // GET: api/student/schedule
        [HttpGet("schedule")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> GetSchedule()
        {
            // ... (Logic cũ)
            // 1. Get Student's CourseId
            var courseIdClaim = User.Claims.FirstOrDefault(c => c.Type == "CourseId");
            if (courseIdClaim == null) return Unauthorized();

            int courseId = int.Parse(courseIdClaim.Value);

            // 2. Fetch Schedule
            var schedule = await _context.Schedules
                .Where(s => s.CourseId == courseId)
                .OrderBy(s => s.Date)
                .Select(s => new 
                {
                    s.Id,
                    Date = s.Date.ToString("yyyy-MM-dd"),
                    DayOfWeek = s.Date.DayOfWeek.ToString(),
                    s.MorningContent,
                    s.AfternoonContent,
                    s.EveningContent,
                    s.Location
                })
                .ToListAsync();

            return Ok(schedule);
        }

        // GET: api/student/grades
        [HttpGet("grades")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> GetGrades()
        {
            // 1. Get StudentId
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (studentIdClaim == null) return Unauthorized();
            int studentId = int.Parse(studentIdClaim.Value);

            // 2. Fetch Grades
            var grades = await _context.StudentGrades
                .Include(g => g.Subject)
                .Where(g => g.StudentId == studentId)
                .Select(g => new
                {
                    g.Id,
                    SubjectName = g.Subject.Name,
                    Credits = g.Subject.Credits,
                    g.Score1,
                    g.Score2,
                    g.FinalScore
                })
                .ToListAsync();

            return Ok(grades);
        }

        // POST: api/student/uniform
        [HttpPost("uniform")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdateUniform([FromBody] StudentUniformDto request)
        {
            // 1. Get StudentId from Token
            var studentIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (studentIdClaim == null) return Unauthorized();

            int studentId = int.Parse(studentIdClaim.Value);

            // 2. Find Student
            var student = await _context.Students.Include(s => s.Course).FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null) return NotFound();

            // 3. Validation
            // 3a. Check if Course is Active
            if (!student.Course.IsActive)
            {
                return BadRequest(new { message = "Khóa học đã kết thúc hoặc chưa bắt đầu. Không thể cập nhật thông tin." });
            }

            // 3b. Validate Height
            if (request.Height < 100 || request.Height > 250)
            {
                return BadRequest(new { message = "Chiều cao không hợp lệ (100cm - 250cm)." });
            }

            // 3c. Validate Size
            var validSizes = new[] { "S", "M", "L", "XL", "XXL" };
            if (!validSizes.Contains(request.UniformSize))
            {
                return BadRequest(new { message = "Size quân phục không hợp lệ." });
            }

            // 4. Update Info
            student.Height = request.Height;
            student.UniformSize = request.UniformSize;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin quân trang thành công!" });
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
                    CourseName = student.Course.Name,
                    // Extra Info
                    student.Height,
                    student.UniformSize,
                    student.Company,
                    student.Platoon,
                    student.RoomNumber,
                    student.Building,
                    student.DateOfBirth,
                    student.Gender,
                    student.IdentificationNumber
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
