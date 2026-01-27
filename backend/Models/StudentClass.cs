using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class StudentClass
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } // e.g. "K21-CNTT01", "12A5"

        public int SchoolId { get; set; }
        [ForeignKey("SchoolId")]
        public School School { get; set; }
    }
}
