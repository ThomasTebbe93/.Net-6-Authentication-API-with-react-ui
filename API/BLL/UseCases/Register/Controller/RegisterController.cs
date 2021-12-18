using API.BLL.Base;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Register.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.UseCases.Register.Controller
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : DefaultController
    {
        private readonly IRegisterService registerService;

        public RegisterController(
            IRegisterService registerService, 
            IRequestService requestService
            ) : base(requestService)
        {
            this.registerService = registerService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [ActionName("JSONMethod")]
        public IActionResult RegisterByLink(UserRestEntity user)
        {
            var res = registerService.Register(user);

            return Ok(res);
        }
    }
}