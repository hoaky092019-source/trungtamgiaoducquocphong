using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public virtual Subject Subject { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; } // "Bài 1: Đối tượng, phương pháp nghiên cứu..."

        public int Order { get; set; } // 1, 2, 3...
    }
}
