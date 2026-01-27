using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTO.Student;
using System.IO;
using OfficeOpenXml; // Add this for EPPlus
using System;
using Microsoft.AspNetCore.Http;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class AdminStudentsController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public AdminStudentsController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents([FromQuery] int page = 1, [FromQuery] int limit = 20, [FromQuery] string search = "")
        {
            var query = _context.Students
                .Include(s => s.School)
                .Include(s => s.Course)
                .Include(s => s.StudentClass) // Include Class
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(s => s.StudentCode.Contains(search) || s.FullName.Contains(search));
            }

            var total = await query.CountAsync();
            var students = await query
                .OrderBy(s => s.StudentCode)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return Ok(new { data = students, total, page, limit });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, Student student)
        {
            if (id != student.Id) return BadRequest();
            _context.Entry(student).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpPost("import")]
        public async Task<IActionResult> Import(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File không hợp lệ");

            int successCount = 0;
            var errors = new List<string>();

            // Pre-fetch caches
            var schools = await _context.Schools.ToDictionaryAsync(s => s.Code.ToLower(), s => s.Id);
            var courses = await _context.Courses.ToDictionaryAsync(c => c.Name.ToLower(), c => c.Id);

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new OfficeOpenXml.ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        try
                        {
                            var studentCode = worksheet.Cells[row, 1].Text?.Trim();
                            var fullName = worksheet.Cells[row, 2].Text?.Trim();
                            var dobText = worksheet.Cells[row, 3].Text?.Trim();
                            var gender = worksheet.Cells[row, 4].Text?.Trim(); // Nam/Nữ
                            var identity = worksheet.Cells[row, 5].Text?.Trim();
                            var schoolCode = worksheet.Cells[row, 6].Text?.Trim();
                            var courseName = worksheet.Cells[row, 7].Text?.Trim();
                            var className = worksheet.Cells[row, 8].Text?.Trim(); // New Column

                            if (string.IsNullOrEmpty(studentCode) || string.IsNullOrEmpty(fullName))
                                continue;

                            // Check Duplicate
                            if (_context.Students.Any(s => s.StudentCode == studentCode))
                            {
                                errors.Add($"Dòng {row}: MSSV {studentCode} đã tồn tại.");
                                continue;
                            }

                            // Resolve IDs
                            if (string.IsNullOrEmpty(schoolCode) || !schools.TryGetValue(schoolCode.ToLower(), out int schoolId))
                            {
                                errors.Add($"Dòng {row}: Mã trường '{schoolCode}' không tồn tại.");
                                continue;
                            }

                            if (string.IsNullOrEmpty(courseName) || !courses.TryGetValue(courseName.ToLower(), out int courseId))
                            {
                                errors.Add($"Dòng {row}: Khóa học '{courseName}' không tồn tại.");
                                continue;
                            }

                            // Resolve Class (GetOrCreate)
                            int? studentClassId = null;
                            if (!string.IsNullOrEmpty(className))
                            {
                                var existingClass = await _context.StudentClasses
                                    .FirstOrDefaultAsync(c => c.Name == className && c.SchoolId == schoolId);
                                
                                if (existingClass != null)
                                {
                                    studentClassId = existingClass.Id;
                                }
                                else
                                {
                                    var newClass = new StudentClass { Name = className, SchoolId = schoolId };
                                    _context.StudentClasses.Add(newClass);
                                    await _context.SaveChangesAsync(); // Need to save to get ID
                                    studentClassId = newClass.Id;
                                }
                            }

                            // Parse Date
                            DateTime? dob = null;
                            if (DateTime.TryParse(dobText, out DateTime dt))
                                dob = dt;


                            var student = new Student
                            {
                                StudentCode = studentCode,
                                FullName = fullName,
                                DateOfBirth = dob,
                                Gender = gender ?? "Nam",
                                IdentificationNumber = identity,
                                SchoolId = schoolId,
                                CourseId = courseId,
                                StudentClassId = studentClassId
                            };

                            _context.Students.Add(student);
                            successCount++;
                        }
                        catch (Exception ex)
                        {
                            errors.Add($"Dòng {row}: Lỗi xử lý - {ex.Message}");
                        }
                    }
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { successCount, errors });
        }
        [HttpGet("template")]
        public async Task<IActionResult> GetTemplate()
        {
            // Fetch live data for dropdowns
            var schools = await _context.Schools.OrderBy(s => s.Code).Select(s => s.Code).ToListAsync();
            var courses = await _context.Courses.Where(c => c.IsActive).OrderBy(c => c.Name).Select(c => c.Name).ToListAsync();

            using (var package = new OfficeOpenXml.ExcelPackage())
            {
                // 1. Data Sheet
                var worksheet = package.Workbook.Worksheets.Add("Students");
                worksheet.Cells[1, 1].Value = "MSSV";
                worksheet.Cells[1, 2].Value = "Họ và tên";
                worksheet.Cells[1, 3].Value = "Ngày sinh (yyyy-MM-dd)";
                worksheet.Cells[1, 4].Value = "Giới tính";
                worksheet.Cells[1, 5].Value = "CMND/CCCD";
                worksheet.Cells[1, 6].Value = "Mã Trường";
                worksheet.Cells[1, 7].Value = "Tên Khóa";
                worksheet.Cells[1, 8].Value = "Tên Lớp"; // New Column

                // Add sample data
                worksheet.Cells[2, 1].Value = "SV001";
                worksheet.Cells[2, 2].Value = "Nguyễn Văn A";
                worksheet.Cells[2, 3].Value = "2000-01-01";
                worksheet.Cells[2, 4].Value = "Nam";
                worksheet.Cells[2, 5].Value = "0792xxxxxx";
                worksheet.Cells[2, 6].Value = schools.FirstOrDefault() ?? "HUTECH";
                worksheet.Cells[2, 7].Value = courses.FirstOrDefault() ?? "K25";
                worksheet.Cells[2, 8].Value = "K25-CNTT01";

                worksheet.Cells.AutoFitColumns();

                // 2. Reference Sheet for Dropdowns
                if (schools.Any() || courses.Any())
                {
                    var refSheet = package.Workbook.Worksheets.Add("Reference");
                    refSheet.Hidden = OfficeOpenXml.eWorkSheetHidden.Hidden; // Hide it

                    // Add Schools to Ref Sheet
                    if (schools.Any())
                    {
                        for (int i = 0; i < schools.Count; i++)
                            refSheet.Cells[i + 1, 1].Value = schools[i];

                        // Create Validation for "Mã Trường" (Col 6)
                        var schoolValidation = worksheet.DataValidations.AddListValidation("F2:F1000");
                        schoolValidation.ShowErrorMessage = true;
                        schoolValidation.ErrorStyle = OfficeOpenXml.DataValidation.ExcelDataValidationWarningStyle.stop;
                        schoolValidation.ErrorTitle = "Lỗi nhập liệu";
                        schoolValidation.Error = "Vui lòng chọn Mã Trường từ danh sách.";
                        // Formula: =Reference!$A$1:$A$N
                        schoolValidation.Formula.ExcelFormula = $"Reference!$A$1:$A${schools.Count}";
                    }

                    // Add Courses to Ref Sheet
                    if (courses.Any())
                    {
                        for (int i = 0; i < courses.Count; i++)
                            refSheet.Cells[i + 1, 2].Value = courses[i];

                        // Create Validation for "Tên Khóa" (Col 7)
                        var courseValidation = worksheet.DataValidations.AddListValidation("G2:G1000");
                        courseValidation.ShowErrorMessage = true;
                        courseValidation.Error = "Vui lòng chọn Khóa học từ danh sách.";
                        // Formula: =Reference!$B$1:$B$N
                        courseValidation.Formula.ExcelFormula = $"Reference!$B$1:$B${courses.Count}";
                    }
                }

                var stream = new MemoryStream();
                package.SaveAs(stream);
                stream.Position = 0;

                string excelName = $"Student_Import_Template.xlsx";
                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
        }


        // POST: api/AdminStudents/BulkAssign
        [HttpPost("BulkAssign")]
        public async Task<IActionResult> BulkAssign([FromBody] BulkAssignDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // 1. Get Students matching School + Course
            var query = _context.Students
                .Where(s => s.SchoolId == dto.SchoolId && s.CourseId == dto.CourseId);

            if (dto.StudentClassId.HasValue)
            {
                query = query.Where(s => s.StudentClassId == dto.StudentClassId.Value);
            }

            var students = await query.ToListAsync();

            if (students.Count == 0) return NotFound("Không tìm thấy sinh viên nào theo tiêu chí!");

            // 1b. Fetch Unit Info
            var battalion = await _context.OrganizationalUnits.FindAsync(dto.BattalionId);
            if (battalion == null) return BadRequest("Tiểu đoàn không tồn tại.");

            var buildings = await _context.Buildings
                .Where(b => dto.BuildingIds.Contains(b.Id))
                .ToDictionaryAsync(b => b.Id, b => b.Name);

            if (buildings.Count == 0) return BadRequest("Vui lòng chọn ít nhất một dãy nhà.");

            // 2. Distribute Logic (Round Robin)
            int buildingCount = dto.BuildingIds.Count;
            int counter = 0;

            foreach (var student in students)
            {
                // Assign Battalion
                student.BattalionId = dto.BattalionId;
                student.Battalion = battalion.Name; // Keep legacy string sync

                // Assign Building (Distribute evenly)
                int checkIndex = counter % buildingCount;
                int targetBuildingId = dto.BuildingIds[checkIndex];

                if (buildings.TryGetValue(targetBuildingId, out string buildingName))
                {
                    student.BuildingId = targetBuildingId;
                    student.Building = buildingName; // Keep legacy string sync
                }

                student.RoomNumber = ""; // Reset Room
                student.Company = "";    // Clear Company string
                student.CompanyId = null; 

                counter++;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Đã phân bổ thành công {students.Count} sinh viên vào {battalion.Name}, rải đều {buildingCount} dãy nhà.",
                UpdatedCount = students.Count
            });
        }
    }
}
