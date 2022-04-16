using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.BLL.Base;
using API.BLL.Helper;
using API.BLL.UseCases.Authentication.Entities;
using API.BLL.UseCases.Authentication.Services;
using API.BLL.UseCases.Files;
using API.BLL.UseCases.Mailing;
using API.BLL.UseCases.Memberships.Daos;
using API.BLL.UseCases.Memberships.Entities;
using API.BLL.UseCases.Memberships.Merger;
using API.BLL.UseCases.Memberships.Validation;
using API.BLL.Extensions;
using API.BLL.UseCases.RolesAndRights.Daos;
using API.BLL.UseCases.RolesAndRights.Entities;
using API.BLL.UseCases.RolesAndRights.Services;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.BLL.UseCases.Memberships.Services
{
    public interface IUserService
    {
        UserRestEntity EnritchUser(UserRestEntity user);
        RequestResult CreateOrUpdate(Context context, List<UserRestEntity> users);
        User FindByIdent(Context context, UserIdent ident);
        User FindByIdentForContext(UserIdent userIdent);
        RequestResult DeleteByIdent(Context context, UserIdent ident);
        IActionResult PasswordChange(Context context, UserPasswordChangeRestEntity userPasswordChange);

        Task<IActionResult> ResetPassword(HttpContext context,
            UserPasswordResetSetPasswordRestEntity userPasswordChange, AuthenticationType authenticationType);

        RequestResult SendResetPassword(UserPasswordResetRestEntity login);
        User CheckUserPasswordForgottenHash(UserPasswordForgottenHashConfirmRestEntity data);
        DataTableSearchResult<User> FindBySearchValue(UserSearchOptions search);
    }

    public class UserService : IUserService
    {
        private readonly IUserDao userDao;
        private readonly UserMerger merger;
        private readonly IAuthenticationService authenticationService;
        private readonly IMailService mailService;
        private readonly AppSettings appSettings;
        private readonly IRoleDao roledao;
        private readonly IRoleService roleService;

        public UserService(
            IUserDao userDao,
            UserMerger merger,
            IAuthenticationService authenticationService,
            IRoleDao roledao,
            IRoleService roleService,
            IOptions<AppSettings> appSettings,
            IMailService mailService)
        {
            this.userDao = userDao;
            this.merger = merger;
            this.authenticationService = authenticationService;
            this.mailService = mailService;
            this.roledao = roledao;
            this.roleService = roleService;
            this.appSettings = appSettings.Value;
        }

        public RequestResult CreateOrUpdate(Context context, List<UserRestEntity> users)
        {
            var validator = new UserValidator(userDao);

            var results = users.Select(user => validator.Validate(user));
            var validationFailures = results.SelectMany(x => x.Errors).ToList();
            if (validationFailures.Any())
                return new RequestResult()
                {
                    ValidationFailures = validationFailures,
                    StatusCode = StatusCode.ValidationError
                };

            try
            {
                var enrichedUser = users.Select(x => EnritchUser(x)).ToList();
                var oldUsers = userDao.FindByIdents(users.Where(user => user.Ident != null)
                    .Select(user => new UserIdent((Guid)user.Ident))
                    .ToHashSet());
                var mergedUsers = enrichedUser.Select(user =>
                    merger.Merge(user, oldUsers.FirstOrDefault(x => x.Ident.Ident == user.Ident))).ToList();

                var toUpdate = mergedUsers.Where(x => x.Ident != null).ToList();
                var toCreate = mergedUsers.Where(x => x.Ident == null).ToList();

                if (!context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                        .Contains(Rights.AdministrationUsersCreate) && toCreate.Count > 0)
                    return new RequestResult()
                    {
                        PermissionFailure = new PermissionFailure()
                        {
                            FailureMessage = PermissionFailureMessage.MissingPermission,
                            UnderlyingRight = Rights.AdministrationUsersCreate
                        },
                        StatusCode = StatusCode.PermissionFailure
                    };

                if (!context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                        .Contains(Rights.AdministrationUsersEdit) && toUpdate.Count > 0)
                    return new RequestResult()
                    {
                        PermissionFailure = new PermissionFailure()
                        {
                            FailureMessage = PermissionFailureMessage.MissingPermission,
                            UnderlyingRight = Rights.AdministrationUsersEdit
                        },
                        StatusCode = StatusCode.PermissionFailure
                    };

                userDao.CreateMany(toCreate.Select(x => x.ToEntity()).ToList());
                userDao.UpdateMany(toUpdate.Select(x => x.ToEntity()).ToList());
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

        public User FindByIdent(Context context, UserIdent ident)
        {
            var user = userDao.FindByIdent(ident);
            var role = user.RoleIdent != null
                ? roleService.FindByIdent(user.RoleIdent)
                : new Role();

            return new User(user)
            {
                Role = role
            };
        }

        public User FindByIdentForContext(UserIdent userIdent)
        {
            var user = userDao.FindByIdentForContext(userIdent);
            var role = user.RoleIdent != null
                ? roleService.FindByIdent(user.RoleIdent)
                : new Role();

            return new User(user)
            {
                Role = role
            };
        }

        public UserRestEntity EnritchUser(UserRestEntity user)
        {
            if (user.Password == null) return new UserRestEntity(user);
            var newSalt = authenticationService.GenerateSalt();
            var hashedPassword = authenticationService.ConvertToHash(user.Password, newSalt);
            var transformedUser = new UserRestEntity(user)
            {
                PasswordHash = hashedPassword,
                PasswordSalt = Convert.ToBase64String(newSalt),
                PasswordChangedDate = DateTime.Now
            };
            return transformedUser;
        }

        public RequestResult DeleteByIdent(Context context, UserIdent ident)
        {
            if (!context.User.Role.Rights.Select(x => x.Key).ToHashSet()
                    .Contains(Rights.AdministrationUsersDelete))
                return new RequestResult()
                {
                    PermissionFailure = new PermissionFailure()
                    {
                        FailureMessage = PermissionFailureMessage.MissingPermission,
                        UnderlyingRight = Rights.AdministrationUsersDelete
                    },
                    StatusCode = StatusCode.PermissionFailure
                };
            try
            {
                userDao.DeleteByIdent(ident);
            }
            catch (Exception e)
            {
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

        public IActionResult PasswordChange(Context context, UserPasswordChangeRestEntity userPasswordChange)
        {
            var validator = new UserPasswordChangeValidator();

            var result = validator.Validate(userPasswordChange);
            var validationFailures = result.Errors;
            if (validationFailures.Any())
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = validationFailures,
                    StatusCode = StatusCode.ValidationError
                });

            var user = userDao.GetUserByUserName(context.User.UserName);
            if (!authenticationService.IsPasswordValid(userPasswordChange.Password, user.PasswordHash,
                    user.PasswordSalt))
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = new List<ValidationFailure>()
                    {
                        new("Password", "validation.error.invalidPassword")
                    },
                    StatusCode = StatusCode.Unauthorized
                });

            try
            {
                var newSalt = authenticationService.GenerateSalt();
                var hashedPassword = authenticationService.ConvertToHash(userPasswordChange.PasswordNew, newSalt);
                var updatedUser = new User(user)
                {
                    PasswordHash = hashedPassword,
                    PasswordSalt = Convert.ToBase64String(newSalt),
                    PasswordChangedDate = DateTime.Now
                };

                userDao.Update(new User(updatedUser));

                var autUser = new AuthenticationUser(user);
                autUser.Token = authenticationService.GenerateToken(autUser);

                return new OkObjectResult(autUser);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);

                return new OkObjectResult(new RequestResult()
                {
                    StatusCode = StatusCode.InternalServerError,
                    Exception = e
                });
            }
        }

        public async Task<IActionResult> ResetPassword(
            HttpContext context,
            UserPasswordResetSetPasswordRestEntity userPasswordChange,
            AuthenticationType authenticationType)
        {
            var validator = new UserPasswordResetSetPasswordValidator();

            var result = validator.Validate(userPasswordChange);
            var validationFailures = result.Errors;
            if (validationFailures.Any())
                return new OkObjectResult(new RequestResult()
                {
                    ValidationFailures = validationFailures,
                    StatusCode = StatusCode.ValidationError
                });

            var user = userDao.FindByIdentForContext(userPasswordChange.UserIdent.ToIdent<UserIdent>());
            if (user.PasswordForgottenHash != userPasswordChange.Hash ||
                user.PasswordForgottenHashDate?.AddMinutes(30) < DateTime.Now) return new BadRequestResult();

            try
            {
                var newSalt = authenticationService.GenerateSalt();
                var hashedPassword = authenticationService.ConvertToHash(userPasswordChange.PasswordNew, newSalt);
                var updatedUser = new User(user)
                {
                    PasswordHash = hashedPassword,
                    PasswordSalt = Convert.ToBase64String(newSalt),
                    PasswordChangedDate = DateTime.Now,
                    PasswordForgottenHash = "",
                    PasswordForgottenHashDate = DateTime.Now.AddDays(-1)
                };

                userDao.Update(new User(updatedUser));

                var currentUser = userDao.FindByIdentForContext(user.Ident); // TODO: JWT erneuern wenn nicht über cookie
                var authUser = authenticationService.GetAuthUser(currentUser);

                switch (authenticationType)
                {
                    case AuthenticationType.Cookie:
                        await authenticationService.SetCookie(authUser, context);
                        break;
                    case AuthenticationType.Jwt:
                        authUser.Token = authenticationService.GenerateToken(authUser);
                        break;
                }

                return new OkObjectResult(authUser);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);

                return new OkObjectResult(new RequestResult()
                {
                    StatusCode = StatusCode.InternalServerError,
                    Exception = e
                });
            }
        }

        public RequestResult SendResetPassword(UserPasswordResetRestEntity login)
        {
            var user = userDao.GetUserByUserName(login.UserName);

            if (user == null)
                return new RequestResult()
                {
                    StatusCode = StatusCode.ValidationError
                };

            if (!login.UserName.IsValidEmail())
                return new RequestResult()
                {
                    StatusCode = StatusCode.ValidationError
                };

            try
            {
                var passwordResetHash = authenticationService.GenerateUrlHash();
                var newUser = new User(user)
                {
                    PasswordForgottenHash = passwordResetHash,
                    PasswordForgottenHashDate = DateTime.Now
                };

                userDao.Update(newUser);

                var baseUrl = appSettings.BaseUrlOffice;
                var applicationName = appSettings.ApplicationName;
                var url =
                    $@"{baseUrl}/authentication/passwordForgotten?userIdent={newUser.Ident}&hash={newUser.PasswordForgottenHash}";

                mailService.SendMail(
                    newUser.UserName,
                    $@"Passwort zurücksetzen - API",
                    $@"<h3>Hallo {newUser.FirstName} {newUser.LastName}</h3>
für deinen Benutzer {newUser.UserName} wurde die Passwort vergessen Funktion von {applicationName} in Anspruch genommen.<br>
Du hast nun 30 Minuten Zeit über diesen <a href=""{url}"" target=""_blank"" >Link</a> dein neues Passwort zu vergeben.<br>
<br>
Mit freundlichen Grüßen<br>
<br>
Dein {applicationName}-Team",
                    new List<File>()
                );

                return new RequestResult()
                {
                    StatusCode = StatusCode.Ok
                };
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
        }

        public User CheckUserPasswordForgottenHash(UserPasswordForgottenHashConfirmRestEntity data)
        {
            var user = userDao.FindByIdentForContext(data.UserIdent.ToIdent<UserIdent>());
            if (user.PasswordForgottenHash != data.Hash ||
                user.PasswordForgottenHashDate?.AddMinutes(30) < DateTime.Now) return null;
            return user.ToOutputUser();
        }

        public DataTableSearchResult<User> FindBySearchValue(UserSearchOptions search)
        {
            var dataTableSearchResult = userDao.FindBySearchValue(search);

            var roles = roledao.FindByIdents(dataTableSearchResult.Data.Select(x => x.RoleIdent).Where(x => x != null)
                .ToHashSet());

            var res = new DataTableSearchResult<User>(dataTableSearchResult)
            {
                Data = dataTableSearchResult.Data.Select(user => new User(user)
                {
                    Role = roles.FirstOrDefault(x => x.Ident == user.RoleIdent)
                }.ToOutputUser()).ToList()
            };

            return new DataTableSearchResult<User>(res);
        }
    }
}