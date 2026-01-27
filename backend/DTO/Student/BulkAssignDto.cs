using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Student
{
    public class BulkAssignDto
    {
        [Required]
        public int SchoolId { get; set; } // Filter Target
        [Required]
        public int CourseId { get; set; } // Filter Target
        
        public int? StudentClassId { get; set; } // Filter Target (Optional)
        
        [Required]
        public int BattalionId { get; set; } // OrganizationalUnitId (Type=Battalion)

        [Required]
        public List<int> BuildingIds { get; set; } // List of Building Ids
    }
}
