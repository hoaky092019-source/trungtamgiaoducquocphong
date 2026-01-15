namespace backend.DTO.Users
{
    public class UpdateUserRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int RoleId { get; set; }
        public int? FacultyId { get; set; }
        public bool Status { get; set; } // Để khóa/mở tài khoản
    }
}