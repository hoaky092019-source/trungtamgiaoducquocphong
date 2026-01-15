namespace backend.DTO.Auth
{
    public class LoginResponse
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public string FacultyName { get; set; } 
        public int? FacultyId { get; set; }     
        public string? Avatar { get; set; }
        public string? Token { get; set; }
        public List<string> Permissions { get; set; } = new List<string>();
    }
}