using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string Code { get; set; } // HP1, HP2...

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public int Credits { get; set; } // Số tín chỉ
    }
}
