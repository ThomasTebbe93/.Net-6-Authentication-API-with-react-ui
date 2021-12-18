using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.Base
{
    [ApiController]
    [Route("[controller]")]
    public class ErrorController : ControllerBase
    {
        public IActionResult Error(
            [FromServices] IWebHostEnvironment webHostEnvironment)
        {
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

            var error = context.Error;

            if (error.GetType() == typeof(HttpResponseException))
            {
                var currentError = (HttpResponseException) error;
                return Problem(
                    statusCode: currentError.StatusCode,
                    detail: context.Error.StackTrace,
                    title: context.Error.Message
                );
            }

            return Problem(
                statusCode: 500,
                detail: context.Error.StackTrace,
                title: context.Error.Message
            );
        }
    }
}