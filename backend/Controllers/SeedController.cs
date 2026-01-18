using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public SeedController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpPost("init")]
        public ActionResult InitData()
        {
            bool changed = false;

            // 1. Schools
            if (!_context.Schools.Any())
            {
                _context.Schools.AddRange(
                    new School { Name = "Trường Đại học Công nghệ TP.HCM", Code = "HUTECH" },
                    new School { Name = "Trường Đại học Kinh tế - Tài chính", Code = "UEF" },
                    new School { Name = "Trường Đại học Quốc tế Hồng Bàng", Code = "HIU" },
                    new School { Name = "Trường Đại học Công nghệ Sài Gòn", Code = "STU" }
                );
                changed = true;
            }

            // 2. Courses
            if (!_context.Courses.Any())
            {
                _context.Courses.AddRange(
                    new Course { Name = "Khóa 423 (Tháng 1/2026)", StartDate = new DateTime(2026, 1, 1), EndDate = new DateTime(2026, 1, 31), IsActive = true },
                    new Course { Name = "Khóa 424 (Tháng 2/2026)", StartDate = new DateTime(2026, 2, 1), EndDate = new DateTime(2026, 2, 28), IsActive = true }
                );
                changed = true;
            }

            if (changed) _context.SaveChanges();

            // 3. Students
            if (!_context.Students.Any())
            {
                var hutech = _context.Schools.FirstOrDefault(s => s.Code == "HUTECH");
                var course423 = _context.Courses.FirstOrDefault(c => c.Name.Contains("423"));

                if (hutech != null && course423 != null)
                {
                    _context.Students.Add(new Student
                    {
                        StudentCode = "123456",
                        FullName = "Nguyễn Văn Sinh Viên",
                        DateOfBirth = new DateTime(2004, 1, 1),
                        Gender = "Nam",
                        SchoolId = hutech.Id,
                        CourseId = course423.Id,
                        IdentificationNumber = "079204000000"
                    });
                    _context.SaveChanges();
                }
            }

            return Ok(new { message = "Data seeded successfully!" });
        }
    }
}
