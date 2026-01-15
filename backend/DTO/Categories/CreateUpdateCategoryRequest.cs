using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Categories
{
    public class CreateUpdateCategoryRequest
    {
        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        public string CategoryName { get; set; }
        
        public string Description { get; set; }
        
        public int? ParentCategoryId { get; set; } 
        
        
    }
}