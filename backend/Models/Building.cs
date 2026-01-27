using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Building
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } // "A1", "C2"

        [MaxLength(200)]
        public string? Description { get; set; }

        public int OrganizationalUnitId { get; set; }
        
        [ForeignKey("OrganizationalUnitId")]
        [JsonIgnore]
        public OrganizationalUnit? OrganizationalUnit { get; set; }
    }
}
