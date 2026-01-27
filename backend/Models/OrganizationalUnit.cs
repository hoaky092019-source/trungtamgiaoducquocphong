using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class OrganizationalUnit
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } // "Tiểu đoàn 1", "Phòng Đào tạo"

        [MaxLength(20)]
        public string Code { get; set; } // "D1", "PDT"

        public UnitType Type { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        // Recursive Relationship
        public int? ParentId { get; set; }
        
        [ForeignKey("ParentId")]
        [JsonIgnore] // Avoid cycle
        public OrganizationalUnit? Parent { get; set; }

        public ICollection<OrganizationalUnit> Children { get; set; } = new List<OrganizationalUnit>();

        // Navigation property for Buildings (if this unit manages buildings, e.g., Battalion)
        public ICollection<Building> Buildings { get; set; } = new List<Building>();
    }
}
