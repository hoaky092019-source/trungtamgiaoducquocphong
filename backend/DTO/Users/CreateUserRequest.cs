namespace backend.DTO.Users
{
    public class CreateUserRequest
    {
        public string Username { get; set; }
        public string Password { get; set; } // Tạo mới thì cần Pass
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int RoleId { get; set; }      // Chọn quyền
        public int? FacultyId { get; set; }  // Chọn khoa (có thể null nếu là Admin)
    }
}