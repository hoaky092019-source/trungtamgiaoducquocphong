using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")] // Uncomment in production
    public class AdminSchoolsController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public AdminSchoolsController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSchools()
        {
            return Ok(await _context.Schools.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchool(int id)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return NotFound();
            return Ok(school);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSchool(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSchool), new { id = school.Id }, school);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchool(int id, School school)
        {
            if (id != school.Id) return BadRequest();
            _context.Entry(school).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchool(int id)
        {
            var school = await _context.Schools.FindAsync(id);
            if (school == null) return NotFound();
            _context.Schools.Remove(school);
            await _context.SaveChangesAsync();
            return NoContent();
        }


        // GET: api/AdminSchools/5/Classes
        [HttpGet("{id}/Classes")]
        public async Task<IActionResult> GetClasses(int id)
        {
            var classes = await _context.StudentClasses
                .Where(c => c.SchoolId == id)
                .OrderBy(c => c.Name)
                .Select(c => new { c.Id, c.Name })
                .ToListAsync();
            return Ok(classes);
        }
    }
}
