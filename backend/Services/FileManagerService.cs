using backend.DTO;
using backend.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class FileManagerService : IFileManagerService
    {
        private readonly TrungtamgiaoducquocphongContext _context;
        private readonly IWebHostEnvironment _env;

        public FileManagerService(TrungtamgiaoducquocphongContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IEnumerable<object>> GetNodes(int? parentId)
        {
            var nodes = await _context.FileNodes
                .Where(x => x.ParentId == parentId)
                .OrderByDescending(x => x.IsFolder)
                .ThenBy(x => x.Name)
                .Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.IsFolder,
                    x.ParentId,
                    x.LastModified,
                    x.Size,
                    x.Path
                })
                .ToListAsync();

            return nodes;
        }

        public async Task<FileNode> CreateFolder(CreateFolderRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Invalid folder name");

            bool exists = await _context.FileNodes.AnyAsync(x => x.ParentId == request.ParentId && x.Name == request.Name && x.IsFolder);
            if (exists)
                throw new InvalidOperationException("Folder already exists");

            var folder = new FileNode
            {
                Name = request.Name,
                IsFolder = true,
                ParentId = request.ParentId,
                LastModified = DateTime.Now,
                Path = "",
                Size = 0,
            };

            _context.FileNodes.Add(folder);
            await _context.SaveChangesAsync();

            return folder;
        }

        public async Task<FileNode> UploadFile(UploadFileRequest request)
        {
            if (request.File == null || request.File.Length == 0)
                throw new ArgumentException("No file selected");

            string rootPath = Path.Combine(_env.WebRootPath, "uploads", "files");
            if (!Directory.Exists(rootPath)) Directory.CreateDirectory(rootPath);

            string fileName = request.File.FileName;
            string uniqueName = $"{Guid.NewGuid()}_{fileName}";
            string filePath = Path.Combine(rootPath, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            string url = $"/uploads/files/{uniqueName}";

            var fileNode = new FileNode
            {
                Name = fileName,
                IsFolder = false,
                ParentId = request.ParentId,
                LastModified = DateTime.Now,
                Size = request.File.Length,
                Path = url
            };

            _context.FileNodes.Add(fileNode);
            await _context.SaveChangesAsync();

            return fileNode;
        }

        public async Task<FileNode> Rename(int id, RenameRequest request)
        {
            var node = await _context.FileNodes.FindAsync(id);
            if (node == null) throw new KeyNotFoundException("Node not found");

            node.Name = request.NewName;
            node.LastModified = DateTime.Now;

            await _context.SaveChangesAsync();
            return node;
        }

        public async Task Delete(int id)
        {
            var node = await _context.FileNodes.FindAsync(id);
            if (node == null) throw new KeyNotFoundException("Node not found");

            if (node.IsFolder)
            {
                bool hasChild = await _context.FileNodes.AnyAsync(x => x.ParentId == id);
                if (hasChild) throw new InvalidOperationException("Folder is not empty");
            }

            _context.FileNodes.Remove(node);
            await _context.SaveChangesAsync();
        }
    }
}
