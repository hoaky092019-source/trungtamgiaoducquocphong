using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrainingSessionsController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public TrainingSessionsController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        // GET: api/TrainingSessions?courseId=1
        [HttpGet]
        public async Task<IActionResult> GetSessions([FromQuery] int? courseId)
        {
            var query = _context.TrainingSessions
                .Include(s => s.Subject)
                .AsQueryable();

            if (courseId.HasValue)
            {
                query = query.Where(s => s.CourseId == courseId.Value);
            }

            var sessions = await query.OrderBy(s => s.Date).ThenBy(s => s.Shift).ToListAsync();
            return Ok(sessions);
        }

        // POST: api/TrainingSessions
        [HttpPost]
        public async Task<IActionResult> CreateSession(TrainingSession session)
        {
            // Basic validation
            if (session.SubjectId == 0) return BadRequest("Subject is required");
            if (session.CourseId == 0) return BadRequest("Course is required");

            _context.TrainingSessions.Add(session);
            await _context.SaveChangesAsync();
            return Ok(session);
        }

        // PUT: api/TrainingSessions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, TrainingSession session)
        {
            if (id != session.Id) return BadRequest();

            _context.Entry(session).State = EntityState.Modified;
            
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TrainingSessions.Any(e => e.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        // DELETE: api/TrainingSessions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.TrainingSessions.FindAsync(id);
            if (session == null) return NotFound();

            _context.TrainingSessions.Remove(session);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/TrainingSessions/Subjects
        [HttpGet("Subjects")]
        public async Task<IActionResult> GetSubjects()
        {
            return Ok(await _context.Subjects.ToListAsync());
        }

        // GET: api/TrainingSessions/Lessons
        [HttpGet("Lessons")]
        public async Task<IActionResult> GetLessons([FromQuery] int? subjectId)
        {
            var query = _context.Lessons.AsQueryable();
            if (subjectId.HasValue)
            {
                query = query.Where(l => l.SubjectId == subjectId.Value);
            }
            return Ok(await query.OrderBy(l => l.Order).ToListAsync());
        }
    }
}
