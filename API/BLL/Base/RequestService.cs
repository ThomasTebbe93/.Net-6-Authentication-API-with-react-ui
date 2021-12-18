using System;
using System.Linq;
using API.BLL.Helper;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Services;
using API.BLL.Extensions;
using API.BLL.UseCases.RolesAndRights.Daos;
using Microsoft.AspNetCore.Http;

namespace API.BLL.Base
{
    public interface IRequestService
    {
        Context GetContextByHttpContext(HttpContext context);
    }

    public class RequestService : IRequestService
    {
        private readonly IUserService userService;
        private readonly IRightDao rightDao;

        public RequestService(
            IUserService userService,
            IRightDao rightDao)
        {
            this.userService = userService;
            this.rightDao = rightDao;
        }

        public Context GetContextByHttpContext(HttpContext context)
        {
            var userIdent =
                new UserIdent(new Guid(context.User.Identity?.Name ?? throw new HttpResponseException(401)));
            var passwordChangeDate =
                DateTime.Parse(context.User.Claims.FirstOrDefault(x => x.Type == "CreateTime")?.Value ??
                               throw new HttpResponseException(401));
            
            if (userIdent == Guid.Empty.ToIdent<UserIdent>())
            {
                return new Context()
                {
                    User = new User()
                    {
                        Ident = Guid.Empty.ToIdent<UserIdent>(),
                        FirstName = "Admin",
                        LastName = "Admin",
                        UserName = "Admin",
                        PasswordChangedDate = DateTime.Now,
                        Role = new UseCases.RolesAndRights.Entities.Role()
                        {
                            Rights = rightDao.FindAll(),
                            Name = "Admin",
                            Description = "Admin",
                        }
                    }
                };
            }

            var currentUser = userService.FindByIdentForContext(userIdent);

            if (passwordChangeDate < currentUser.PasswordChangedDate)
            {
                throw new HttpResponseException(401);
            }

            return new Context()
            {
                User = currentUser,
            };
        }
    }
}