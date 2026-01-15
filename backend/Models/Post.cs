using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Post
{
    public int PostId { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int AuthorId { get; set; }

    public int? FacultyId { get; set; }

    public int? CategoryId { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Slug { get; set; }

    public string? Thumbnail { get; set; }

    public int ViewCount { get; set; }

    public DateTime? PublishedAt { get; set; }

    public int? ApproverId { get; set; }

    public string? ApprovalComment { get; set; }

    public virtual User Author { get; set; } = null!;

    public virtual User? Approver { get; set; }

    public virtual Category? Category { get; set; }

    public virtual Faculty? Faculty { get; set; }
}
