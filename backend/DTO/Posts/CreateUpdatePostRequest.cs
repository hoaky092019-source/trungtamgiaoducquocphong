using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Posts
{
    public class CreateUpdatePostRequest
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        public string Title { get; set; }

        public string Content { get; set; }

        public string Thumbnail { get; set; }

        public int? CategoryId { get; set; }
        
        public int? FacultyId { get; set; } 

        public string Status { get; set; } = "Draft"; // Mặc định là Draft
    }
}