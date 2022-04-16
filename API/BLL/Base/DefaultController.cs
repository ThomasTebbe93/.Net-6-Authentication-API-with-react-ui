using API.BLL.Helper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.Base
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class DefaultController : ControllerBase
    {
        private IRequestService requestService;

        protected Context Context =>
            string.IsNullOrEmpty(HttpContext?.User?.Identity?.Name)
                ? null
                : requestService.GetContextByHttpContext(HttpContext).Result;

        protected DefaultController(IRequestService requestService)
        {
            this.requestService = requestService;
        }
    }
}