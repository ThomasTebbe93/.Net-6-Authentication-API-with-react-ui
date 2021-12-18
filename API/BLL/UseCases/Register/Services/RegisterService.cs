using System;
using System.Linq;
using API.BLL.Base;
using API.BLL.UseCases.Mailing;
using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Merger;
using API.BLL.UseCases.Memberships.Services;
using API.BLL.UseCases.Memberships.Validation;

namespace API.BLL.UseCases.Register.Services
{
    public interface IRegisterService
    {
        RequestResult Register(UserRestEntity user);
    }

    public class RegisterService : IRegisterService
    {
        private readonly IUserDao userDao;
        private readonly UserMerger merger;
        private readonly IUserService userService;

        public RegisterService(
            IUserDao userDao,
            UserMerger merger,
            IUserService userService)
        {
            this.userService = userService;
            this.userDao = userDao;
            this.merger = merger;
        }


        public RequestResult Register(UserRestEntity user)
        {
            var validator = new UserValidator(userDao);
            var result = validator.Validate(user);
            var validationFailures = result.Errors.ToList();
            if (validationFailures.Any())
                return new RequestResult()
                {
                    ValidationFailures = validationFailures,
                    StatusCode = StatusCode.ValidationError
                };
            try
            {
                var enrichedUser = userService.EnritchUser(user);
                var mergedUser = merger.Merge(enrichedUser, null);
                userDao.Create(mergedUser.ToEntity());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return new RequestResult()
                {
                    StatusCode = StatusCode.InternalServerError,
                    Exception = e
                };
            }

            return new RequestResult()
            {
                StatusCode = StatusCode.Ok
            };
        }
    }
}