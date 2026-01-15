namespace backend.DTO.Posts
{
    public class PostDto
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; } // Nếu model không có Summary, ta có thể cắt từ Content
        public string Content { get; set; }
        public string Thumbnail { get; set; } // Đổi tên từ Image -> Thumbnail
        public string Status { get; set; }    // Đổi bool -> string
        public string Slug { get; set; }     
        public int ViewCount { get; set; }
        public DateTime? CreatedAt { get; set; }

        // --- Thông tin liên kết ---
        public string CategoryName { get; set; }
        public string FacultyName { get; set; } 
        public string AuthorName { get; set; }  
        public string ApproverName { get; set; }
        public string ApprovalComment { get; set; }

        // Dùng để bind dữ liệu khi Sửa
        public int? CategoryId { get; set; }
        public int? FacultyId { get; set; }
    }
}