using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.BLL.Base;
using API.BLL.UseCases.Authentication.Entities;
using API.BLL.UseCases.Authentication.Services;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.BLL.UseCases.Memberships.Controller
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : DefaultController
    {
        private readonly IUserService userService;
        private readonly IAuthenticationService authenticationService;

        public UserController(
            IUserService userService,
            IRequestService requestService,
            IAuthenticationService authenticationService)
            : base(requestService)
        {
            this.userService = userService;
            this.authenticationService = authenticationService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserRestEntity userParam) =>
            authenticationService.Authenticate(userParam.UserName, userParam.Password);


        [HttpGet("getUserinfo")]
        public IActionResult GetUserinfo()
        {
            return Ok(new User(Context.User).ToOutputUser());
        }

        [HttpPost("passwordChange")]
        [ActionName("JSONMethod")]
        public IActionResult PasswordChange(UserPasswordChangeRestEntity userPasswordChange) =>
            userService.PasswordChange(Context, userPasswordChange);

        [AllowAnonymous]
        [HttpPost("resetPasswordJwt")]
        [ActionName("JSONMethod")]
        public async Task<IActionResult> ResetPasswordJwt(UserPasswordResetSetPasswordRestEntity userPasswordReset)
            => await userService.ResetPassword(HttpContext, userPasswordReset, AuthenticationType.Jwt);
        
        [AllowAnonymous]
        [HttpPost("resetPasswordCookie")]
        [ActionName("JSONMethod")]
        public async Task<IActionResult> ResetPasswordCookie(UserPasswordResetSetPasswordRestEntity userPasswordReset)
            => await userService.ResetPassword(HttpContext, userPasswordReset, AuthenticationType.Cookie);

        [AllowAnonymous]
        [HttpPost("sendResetPassword")]
        [ActionName("JSONMethod")]
        public IActionResult SendResetPassword(UserPasswordResetRestEntity login)
        {
            var res = userService.SendResetPassword(login);
            return Ok(res);
        }

        [HttpPost("createorupdate")]
        [ActionName("JSONMethod")]
        public IActionResult CreateOrUpdate(List<UserRestEntity> users)
        {
            var res = userService.CreateOrUpdate(Context, users);

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

        [HttpGet("deleteByIdent/{ident}")]
        public IActionResult DeleteByIdent(Guid ident)
        {
            if (!Context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                    .Contains(Rights.AdministrationUsersDelete))
                Ok(new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationUsersDelete
                    },
                    StatusCode = Base.StatusCode.PermissionFailure
                });

            var res = userService.DeleteByIdent(Context, new UserIdent(ident));
            return Ok(res);
        }

        [HttpGet("getByIdent/{ident}")]
        public IActionResult GetByIdent(Guid ident)
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

            var user = userService.FindByIdent(Context, new UserIdent(ident));

            return Ok(new User(user).ToOutputUser());
        }
    }
}