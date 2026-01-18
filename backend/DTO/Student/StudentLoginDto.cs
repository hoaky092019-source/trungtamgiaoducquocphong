using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Student
{
    public class StudentLoginDto
    {
        [Required]
        public int SchoolId { get; set; }
        
        [Required]
        public int CourseId { get; set; }
        
        [Required]
        public string StudentCode { get; set; }
    }
}
