using System.ComponentModel.DataAnnotations;

namespace backend.DTO.Faculties
{
    public class CreateUpdateFacultyRequest
    {
        [Required(ErrorMessage = "Tên khoa không được để trống")]
        public string FacultyName { get; set; }
        public string Description { get; set; }
    }
}