using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Text;
// jwt
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using elFinder.Net.AspNetCore.Extensions;
using elFinder.Net.Drivers.FileSystem;
using elFinder.Net.Drivers.FileSystem.Extensions;
using elFinder.Net.Core;
var builder = WebApplication.CreateBuilder(args);

// Fix EPPlus 8 License
OfficeOpenXml.ExcelPackage.License.SetNonCommercialPersonal("StudentPortal");

// 1. Kết nối Database
builder.Services.AddDbContext<TrungtamgiaoducquocphongContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// --- 2. CẤU HÌNH JWT AUTHENTICATION ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
// ---------------------------------------
// 2. Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<backend.Services.IFileManagerService, backend.Services.FileManagerService>();
builder.Services.AddScoped<backend.Services.INotificationService, backend.Services.NotificationService>();

// --- elFinder Config ---
// --- elFinder Config ---
builder.Services.AddElFinderAspNetCore()
    .AddFileSystemDriver(typeof(FileSystemDriver));


// 3. Cấu hình Swagger (Phải cài gói Swashbuckle.AspNetCore mới chạy được dòng này)
builder.Services.AddSwaggerGen(); 

// 4. Cấu hình CORS (Cho phép React truy cập)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", b => 
        b.WithOrigins("http://localhost:3000")
         .AllowAnyMethod()
         .AllowAnyHeader()
         .AllowCredentials());
});

var app = builder.Build();

// Configure the HTTP request pipeline.r UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 6. Kích hoạt CORS (Đặt trước Authorization)
app.UseCors("AllowAll");

// Cấu hình Static Files rõ ràng để đảm bảo nhận đúng thư mục wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot")),
    RequestPath = ""
});

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();