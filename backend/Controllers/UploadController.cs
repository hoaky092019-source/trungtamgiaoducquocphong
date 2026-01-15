using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        // API dành riêng cho CKEditor 4 (Trả về JSON format đặc thù)
        [HttpPost("image-ck4")]
        public async Task<IActionResult> UploadImageCK4(IFormFile upload)
        {
            // 1. Kiểm tra file
            if (upload == null || upload.Length == 0)
                return Ok(new { uploaded = 0, error = new { message = "Không có file được gửi lên." } });

            try
            {
                // 2. Tạo đường dẫn lưu file vào thư mục: wwwroot/uploads/images/
                string webRootPath = _environment.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRootPath))
                {
                    // Fallback nếu chưa cấu hình wwwroot
                    webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                string uploadsFolder = Path.Combine(webRootPath, "uploads", "images");
                
                // Tạo thư mục nếu chưa có
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                // 3. Tạo tên file duy nhất (tránh trùng lặp)
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + upload.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // 4. Lưu file xuống ổ cứng
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await upload.CopyToAsync(fileStream);
                }

                // 5. Tạo đường dẫn URL công khai để trả về
                // Ví dụ: http://localhost:5076/uploads/images/abc.jpg
                string imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/images/{uniqueFileName}";

                // 6. QUAN TRỌNG: Trả về đúng định dạng JSON mà CKEditor 4 yêu cầu
                return Ok(new 
                { 
                    uploaded = 1, 
                    fileName = uniqueFileName, 
                    url = imageUrl 
                });
            }
            catch (Exception ex)
            {
                return Ok(new { uploaded = 0, error = new { message = "Lỗi server: " + ex.Message } });
            }
        }
    }
}