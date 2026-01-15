namespace backend.DTO.Categories
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Slug { get; set; } 
        public string Description { get; set; }
        
        // Map đúng tên trong Model của bạn
        public int? ParentCategoryId { get; set; } 
        public string ParentCategoryName { get; set; } 
        
        public DateTime? CreatedAt { get; set; }
    }
}