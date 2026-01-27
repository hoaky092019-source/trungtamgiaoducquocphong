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

            // 4. Schedules (New)
            if (!_context.Schedules.Any())
            {
                var course423 = _context.Courses.FirstOrDefault(c => c.Name.Contains("423"));
                if (course423 != null)
                {
                    _context.Schedules.AddRange(
                        new Schedule { CourseId = course423.Id, Date = new DateTime(2026, 1, 12), MorningContent = "Chào cờ đầu tuần", AfternoonContent = "Học chính trị", Location = "Hội trường A" },
                        new Schedule { CourseId = course423.Id, Date = new DateTime(2026, 1, 13), MorningContent = "Điều lệnh đội ngũ", AfternoonContent = "Tháo lắp súng", Location = "Sân chào cờ" },
                        new Schedule { CourseId = course423.Id, Date = new DateTime(2026, 1, 14), MorningContent = "Chiến thuật bộ binh", AfternoonContent = "Thể dục thể thao", Location = "Bãi tập 1" }
                    );
                    _context.SaveChanges();
                    changed = true;
                }
            }

            // 5. Subjects & Grades
            if (!_context.Subjects.Any())
            {
                _context.Subjects.AddRange(
                    new Subject { Name = "Giáo dục chính trị", Credits = 2 },
                    new Subject { Name = "Quân sự chung", Credits = 3 },
                    new Subject { Name = "Kỹ thuật chiến đấu bộ binh", Credits = 4 },
                    new Subject { Name = "Chiến thuật bộ binh", Credits = 2 }
                );
                _context.SaveChanges();
                changed = true;
            }

            if (!_context.StudentGrades.Any())
            {
                var student = _context.Students.SingleOrDefault(s => s.StudentCode == "123456");
                var subjects = _context.Subjects.ToList();

                if (student != null && subjects.Any())
                {
                    _context.StudentGrades.AddRange(
                        new StudentGrade { StudentId = student.Id, SubjectId = subjects[0].Id, Score1 = 8.5, Score2 = 9.0, FinalScore = 8.8 },
                        new StudentGrade { StudentId = student.Id, SubjectId = subjects[1].Id, Score1 = 7.0, Score2 = 7.5, FinalScore = 7.2 },
                        new StudentGrade { StudentId = student.Id, SubjectId = subjects[2].Id, Score1 = 9.0, Score2 = 9.5, FinalScore = 9.3 }
                    );
                    _context.SaveChanges();
                    changed = true;
                }
            }

            return Ok(new { message = "Data seeded successfully!" });
        }
    }
}
