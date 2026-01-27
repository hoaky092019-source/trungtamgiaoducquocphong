using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminUnitsController : ControllerBase
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public AdminUnitsController(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        // --- Organizational Units ---

        [HttpGet]
        public async Task<IActionResult> GetUnits([FromQuery] UnitType? type)
        {
            var query = _context.OrganizationalUnits.AsQueryable();
            if (type.HasValue)
            {
                query = query.Where(u => u.Type == type.Value);
            }
            return Ok(await query.OrderBy(u => u.Name).ToListAsync());
        }

        [HttpGet("hierarchy")]
        public async Task<IActionResult> GetHierarchy()
        {
            // Fetch all and build tree in memory for simplicity
            var allUnits = await _context.OrganizationalUnits
                .Include(u => u.Buildings)
                .ToListAsync();

            var roots = allUnits.Where(u => u.ParentId == null).ToList();
            
            // Note: EF Core Fix-up usually handles the children if we load everything
            // But manually ensuring structure can be safer. 
            // Here, relying on serialization to handle structure if Parent/Children links are set correctly.
            // Using DTOs is safer to avoid cycles, but for now we follow the existing pattern.
            // CAUTION: Default JSON serializer might choke on cycles if Children are loaded.
            // We ignored Parent in JSON, so it should be fine top-down.

            return Ok(roots);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _context.OrganizationalUnits
                .Include(u => u.Children)
                .Include(u => u.Buildings)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (unit == null) return NotFound();
            return Ok(unit);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnit(OrganizationalUnit unit)
        {
            _context.OrganizationalUnits.Add(unit);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUnit(int id, OrganizationalUnit unit)
        {
            if (id != unit.Id) return BadRequest();
            _context.Entry(unit).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            var unit = await _context.OrganizationalUnits.FindAsync(id);
            if (unit == null) return NotFound();

            // Optional: Check for children or students constraints
            if (await _context.OrganizationalUnits.AnyAsync(u => u.ParentId == id))
            {
                return BadRequest("Không thể xóa đơn vị vì còn đơn vị trực thuộc.");
            }

            _context.OrganizationalUnits.Remove(unit);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // --- Buildings ---

        [HttpGet("{unitId}/buildings")]
        public async Task<IActionResult> GetBuildings(int unitId)
        {
            var buildings = await _context.Buildings
                .Where(b => b.OrganizationalUnitId == unitId)
                .ToListAsync();
            return Ok(buildings);
        }

        [HttpPost("{unitId}/buildings")]
        public async Task<IActionResult> AddBuilding(int unitId, Building building)
        {
            building.OrganizationalUnitId = unitId;
            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();
            return Ok(building);
        }

        [HttpPut("buildings/{id}")]
        public async Task<IActionResult> UpdateBuilding(int id, Building building)
        {
            if (id != building.Id) return BadRequest();
            _context.Entry(building).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("buildings/{id}")]
        public async Task<IActionResult> DeleteBuilding(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building == null) return NotFound();
            _context.Buildings.Remove(building);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
