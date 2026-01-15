using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class FileNode
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool IsFolder { get; set; }

    public int? ParentId { get; set; }

    public string Path { get; set; } = null!;

    public long? Size { get; set; }

    public DateTime LastModified { get; set; }

    public int? UploadedByUserId { get; set; }

    public virtual ICollection<FileNode> InverseParent { get; set; } = new List<FileNode>();

    public virtual FileNode? Parent { get; set; }

    public virtual User? UploadedByUser { get; set; }
}
