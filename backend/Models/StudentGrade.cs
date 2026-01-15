using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class StudentGrade
    {
        [Key]
        public int Id { get; set; }
        
        public int StudentId { get; set; }
        [ForeignKey("StudentId")]
        public Student Student { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string ModuleName { get; set; } // Tên học phần
        
        public double Score { get; set; }
        
        [MaxLength(20)]
        public string? Classification { get; set; } // Xếp loại (Giỏi, Khá...)
    }
}
