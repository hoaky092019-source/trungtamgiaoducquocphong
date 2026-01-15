using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly TrungtamgiaoducquocphongContext _context;

        public NotificationService(TrungtamgiaoducquocphongContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, string title, string message, string type = "info", string? link = null)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                Link = link,
                CreatedAt = DateTime.Now,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task BroadcastToAdminsAsync(string title, string message, string type = "info", string? link = null, int? facultyId = null)
        {
            // 1. Tìm tất cả User có Role là 'Admin'
            var admins = await _context.Users
                .Where(u => u.Role.RoleName == "Admin" && u.Status == true)
                .Select(u => u.UserId)
                .ToListAsync();

            // 2. Tìm tất cả User có Role là 'FacultyAdmin' (lọc theo khoa nếu có)
            var facultyAdminsQuery = _context.Users
                .Where(u => u.Role.RoleName == "FacultyAdmin" && u.Status == true);

            if (facultyId.HasValue)
            {
                facultyAdminsQuery = facultyAdminsQuery.Where(u => u.FacultyId == facultyId.Value);
            }

            var facultyAdmins = await facultyAdminsQuery.Select(u => u.UserId).ToListAsync();

            // 3. Hợp nhất danh sách và gửi thông báo
            var targetUserIds = admins.Concat(facultyAdmins).Distinct().ToList();

            if (!targetUserIds.Any())
            {
                // Fallback nếu không tìm thấy ai (Gửi cho ID 1)
                targetUserIds.Add(1);
            }

            foreach (var userId in targetUserIds)
            {
                var notification = new Notification
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = type,
                    Link = link,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
            }

            await _context.SaveChangesAsync();
        }
    }
}
