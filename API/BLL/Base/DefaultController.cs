using API.BLL.Helper;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.Base
{
    public class DefaultController : ControllerBase
    {
        private IRequestService requestService;

        protected Context Context =>
            string.IsNullOrEmpty(HttpContext?.User?.Identity?.Name)
                ? null
                : requestService.GetContextByHttpContext(HttpContext);

        protected DefaultController(IRequestService requestService)
        {
            this.requestService = requestService;
        }
    }
}