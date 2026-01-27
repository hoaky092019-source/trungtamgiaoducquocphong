using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class AdminCoursesController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public AdminCoursesController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            return Ok(await _context.Courses.OrderByDescending(c => c.StartDate).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();
            return Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, Course course)
        {
            if (id != course.Id) return BadRequest();
            _context.Entry(course).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
