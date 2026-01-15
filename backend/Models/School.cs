using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class School
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } // e.g. "Đại học Công nghệ TP.HCM"
        
        [Required]
        [MaxLength(50)]
        public string Code { get; set; } // e.g. "HUTECH"
    }
}
