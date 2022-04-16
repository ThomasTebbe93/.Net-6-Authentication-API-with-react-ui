using System.Linq;
using System.Threading.Tasks;
using API.BLL.Base;
using API.BLL.UseCases.Authentication.Entities;
using API.BLL.UseCases.Authentication.Services;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.UseCases.Authentication.Controller
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController
        : DefaultController
    {
        private readonly IAuthenticationService authenticationService;
        private readonly IUserService userService;

        public AuthenticationController(
            IAuthenticationService authenticationService,
            IUserService userService,
            IRequestService requestService) : base(requestService)
        {
            this.authenticationService = authenticationService;
            this.userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate(AuthenticationRestEntity userParam) =>
            authenticationService.Authenticate(userParam.UserName, userParam.Password);
        
        [AllowAnonymous]
        [HttpPost("authenticateWithCookie")]
        public async Task<IActionResult> AuthenticateWithCookie(AuthenticationRestEntity userParam)
            => await authenticationService.AuthenticateWithCookie(userParam.UserName, userParam.Password, HttpContext);

        [AllowAnonymous]
        [HttpPost("checkUserPasswordForgottenHash")]
        [ActionName("JSONMethod")]
        public IActionResult CheckUserPasswordForgottenHash(UserPasswordForgottenHashConfirmRestEntity data)
        {
            var res = userService.CheckUserPasswordForgottenHash(data);
            if (res == null) return BadRequest();
            return Ok(res);
        }
        
        [HttpPost("findBySearchValue")]
        public IActionResult FindBySearchValue(UserSearchOptions searchOptions)
        {
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                    .Contains(Rights.AdministrationUsers))
                Ok(new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationUsers
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });
            
            var users = userService.FindBySearchValue(searchOptions);

            return Ok(users);
        }
    }
}