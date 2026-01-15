using Microsoft.AspNetCore.Mvc;

namespace TrungTamGiaoDucQuocPhong.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok(new
            {
                Title = "Trung tâm Giáo dục Quốc phòng",
                Message = "Chào mừng bạn đến với trang chủ!"
            });
        }
    }
}
