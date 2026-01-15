using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Document
{
    public int DocumentId { get; set; }

    public string Title { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public int UploadedBy { get; set; }

    public int? FacultyId { get; set; }

    public string TargetAudience { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual Faculty? Faculty { get; set; }

    public virtual User UploadedByNavigation { get; set; } = null!;
}
