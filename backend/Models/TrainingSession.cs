using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TrainingSession
    {
        [Key]
        public int Id { get; set; }

        public int CourseId { get; set; }
        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }

        public DateTime Date { get; set; }

        [MaxLength(50)]
        public string Shift { get; set; } // "Sáng", "Chiều", "Tối"

        [MaxLength(500)]
        public string Content { get; set; } // Tên bài học

        [MaxLength(500)]
        public string? Description { get; set; } // Ghi chú thêm

        [MaxLength(100)]
        public string? Location { get; set; }

        [MaxLength(100)]
        public string? Lecturer { get; set; }
    }
}
