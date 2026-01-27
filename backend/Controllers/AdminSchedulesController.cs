using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin")]
    public class AdminSchedulesController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public AdminSchedulesController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSchedules([FromQuery] int? courseId)
        {
            var query = _context.Schedules.Include(s => s.Course).AsQueryable();

            if (courseId.HasValue)
            {
                query = query.Where(s => s.CourseId == courseId.Value);
            }

            return Ok(await query.OrderBy(s => s.Date).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateSchedule(Schedule schedule)
        {
            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();
            return Ok(schedule);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, Schedule schedule)
        {
            if (id != schedule.Id) return BadRequest();
            _context.Entry(schedule).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound();
            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
