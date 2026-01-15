using System.Threading.Tasks;

namespace backend.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId, string title, string message, string type = "info", string? link = null);
        Task BroadcastToAdminsAsync(string title, string message, string type = "info", string? link = null, int? facultyId = null);
    }
}
