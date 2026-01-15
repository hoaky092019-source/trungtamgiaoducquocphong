using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Services
{
    public interface IFileManagerService
    {
        Task<IEnumerable<object>> GetNodes(int? parentId);
        Task<FileNode> CreateFolder(CreateFolderRequest request);
        Task<FileNode> UploadFile(UploadFileRequest request);
        Task<FileNode> Rename(int id, RenameRequest request);
        Task Delete(int id);
    }
}
