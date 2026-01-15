using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string StudentCode { get; set; } // MSSV (Login Key)
        
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }
        
        public DateTime? DateOfBirth { get; set; }
        
        [MaxLength(10)]
        public string Gender { get; set; } // Nam/Nữ
        
        [MaxLength(20)]
        public string IdentificationNumber { get; set; } // CCCD
        
        // Foreign Keys
        public int SchoolId { get; set; }
        [ForeignKey("SchoolId")]
        public School School { get; set; }
        
        public int CourseId { get; set; }
        [ForeignKey("CourseId")]
        public Course Course { get; set; }
        
        // Feature 1: Quân Trang
        public int? Height { get; set; } // Chiều cao (cm)
        [MaxLength(10)]
        public string? UniformSize { get; set; } // S, M, L, XL...
        
        // Feature 2 & 3: Info
        [MaxLength(50)]
        public string? Company { get; set; } // Đại đội
        [MaxLength(50)]
        public string? Platoon { get; set; } // Trung đội/Tiểu đội
        [MaxLength(20)]
        public string? RoomNumber { get; set; } // Phòng số
        [MaxLength(50)]
        public string? Building { get; set; } // Dãy nhà
    }
}
