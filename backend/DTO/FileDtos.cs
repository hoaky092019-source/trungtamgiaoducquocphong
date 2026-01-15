using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.DTO
{
    public class CreateFolderRequest
    {
        [Required]
        public string Name { get; set; }
        public int? ParentId { get; set; }
    }

    public class UploadFileRequest
    {
        [Required]
        public IFormFile File { get; set; }
        public int? ParentId { get; set; }
    }

    public class RenameRequest 
    {
        [Required]
        public string NewName { get; set; }
    }
}
