namespace backend.DTO.Users
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool? Status { get; set; }
        public int RoleId { get; set; }      
        public int? FacultyId { get; set; }
        // Thông tin hiển thị từ bảng khác
        public string RoleName { get; set; }
        public string FacultyName { get; set; }
    }
}