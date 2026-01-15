using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class SiteStatistic
{
    public int Id { get; set; }

    public DateOnly AccessDate { get; set; }

    public int TotalVisits { get; set; }

    public int MonthlyVisits { get; set; }

    public int DailyVisits { get; set; }

    public int OnlineUsers { get; set; }

    public DateTime UpdatedAt { get; set; }
}
