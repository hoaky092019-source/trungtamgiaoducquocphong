using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }

        public int CourseId { get; set; }
        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        public DateTime Date { get; set; } // Ngày học

        [MaxLength(255)]
        public string? MorningContent { get; set; } // Sáng

        [MaxLength(255)]
        public string? AfternoonContent { get; set; } // Chiều

        [MaxLength(255)]
        public string? EveningContent { get; set; } // Tối (nếu có)

        [MaxLength(100)]
        public string? Location { get; set; } // Địa điểm (Giảng đường, Thao trường...)

        [MaxLength(100)]
        public string? Lecturer { get; set; } // Giảng viên (Tên dạng text)
    }
}
