using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Log
{
    public int LogId { get; set; }

    public int UserId { get; set; }

    public string Action { get; set; } = null!;

    public int? TargetId { get; set; }

    public DateTime? Timestamp { get; set; }

    public string? Ipaddress { get; set; }

    public virtual User User { get; set; } = null!;
}
