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

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }

        public double? Score1 { get; set; } // Điểm quá trình 1
        public double? Score2 { get; set; } // Điểm quá trình 2
        public double? FinalScore { get; set; } // Điểm thi kết thúc
    }
}
