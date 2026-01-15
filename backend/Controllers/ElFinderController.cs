using elFinder.Net.AspNetCore.Extensions;
using elFinder.Net.AspNetCore.Helper;
using elFinder.Net.Core;
using elFinder.Net.Drivers.FileSystem;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("el-finder/connector")]
    [ApiController]
    public class ElFinderController : ControllerBase
    {
        private readonly IConnector _connector;
        private readonly IWebHostEnvironment _env;
        private readonly IDriver _driver;

        public ElFinderController(IConnector connector, IWebHostEnvironment env, IDriver driver)
        {
            _connector = connector;
            _env = env;
            _driver = driver;
        }

        [Route("")]
        [HttpGet, HttpPost]
        public async Task<IActionResult> Connector()
        {
            var rootPath = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(rootPath);
            var thumbPath = Path.Combine(_env.WebRootPath, ".tmb");
            Directory.CreateDirectory(thumbPath);

            var baseUrl = $"{Request.Scheme}://{Request.Host}/uploads/";
            var thumbUrl = $"{Request.Scheme}://{Request.Host}/.tmb/";

            var root = new Volume(
                _driver,
                rootPath,
                baseUrl,
                thumbUrl,
                thumbPath,
                thumbUrl, // tmbUrl
                thumbPath, // tmbPath
                Path.GetTempPath(),
                Path.DirectorySeparatorChar
            )
            {
                // Alias = "My Files", // Property not found
                IsLocked = false,
                IsReadOnly = false
            };

            _connector.AddVolume(root);

            var command = ConnectorHelper.ParseCommand(Request);
            var result = await _connector.ProcessAsync(command);
            return result.ToActionResult(HttpContext);
        }
    }
}
