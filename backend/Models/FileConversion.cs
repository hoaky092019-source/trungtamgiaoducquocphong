using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class FileConversion
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string OriginalFileName { get; set; } = null!;

    public string ConvertedFileName { get; set; } = null!;

    public string ConvertType { get; set; } = null!;

    public decimal? FileSizeKb { get; set; }

    public string? UploadPath { get; set; }

    public string? OutputPath { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
