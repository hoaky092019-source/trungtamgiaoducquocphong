namespace backend.DTO.Faculties
{
    public class FacultyDto
    {
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}