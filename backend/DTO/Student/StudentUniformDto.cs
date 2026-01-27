using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Student
{
    public class StudentUniformDto
    {
        [Required]
        [Range(100, 250)]
        public int Height { get; set; }

        [Required]
        [RegularExpression("^(S|M|L|XL|XXL)$", ErrorMessage = "Size must be S, M, L, XL, or XXL")]
        public string UniformSize { get; set; }
    }
}
